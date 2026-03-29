import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import pg from "pg";
import twilio from "twilio";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json());

const databaseUrl = process.env.DATABASE_URL;
const usePostgres = Boolean(databaseUrl);
const { Pool } = pg;

let sqliteDb = null;
let insertQuoteSqlite = null;
let postgresPool = null;

if (usePostgres) {
  postgresPool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.PG_SSL === "false" ? false : { rejectUnauthorized: false },
  });
} else {
  const dbDir = path.join(process.cwd(), "server", "data");
  fs.mkdirSync(dbDir, { recursive: true });

  sqliteDb = new Database(path.join(dbDir, "quotes.db"));
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      service_type TEXT NOT NULL,
      move_date TEXT,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  insertQuoteSqlite = sqliteDb.prepare(`
    INSERT INTO quotes (
      full_name,
      phone,
      email,
      service_type,
      move_date,
      pickup_location,
      dropoff_location,
      details
    ) VALUES (
      @fullName,
      @phone,
      @email,
      @serviceType,
      @moveDate,
      @pickupLocation,
      @dropoffLocation,
      @details
    )
  `);
}

const initPostgres = async () => {
  if (!postgresPool) {
    return;
  }

  await postgresPool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      service_type TEXT NOT NULL,
      move_date TEXT,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

const insertQuote = async (quote) => {
  if (postgresPool) {
    const result = await postgresPool.query(
      `
      INSERT INTO quotes (
        full_name,
        phone,
        email,
        service_type,
        move_date,
        pickup_location,
        dropoff_location,
        details
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
      `,
      [
        quote.fullName,
        quote.phone,
        quote.email,
        quote.serviceType,
        quote.moveDate || null,
        quote.pickupLocation,
        quote.dropoffLocation,
        quote.details,
      ]
    );

    return Number(result.rows[0].id);
  }

  const result = insertQuoteSqlite.run(quote);
  return Number(result.lastInsertRowid);
};

const twilioToNumber = process.env.TWILIO_TO_NUMBER || "+19049421059";
const twilioMessagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const twilioReady =
  Boolean(process.env.TWILIO_ACCOUNT_SID) &&
  Boolean(process.env.TWILIO_AUTH_TOKEN) &&
  Boolean(twilioMessagingServiceSid) &&
  Boolean(twilioToNumber);

const smsClient = twilioReady
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const trimValue = (value) => (typeof value === "string" ? value.trim() : "");

const formatSms = (quote) => {
  const dateLabel = quote.moveDate || "Not specified";

  return [
    "New Quote Request",
    `Name: ${quote.fullName}`,
    `Phone: ${quote.phone}`,
    `Email: ${quote.email}`,
    `Service: ${quote.serviceType}`,
    `Date: ${dateLabel}`,
    `Pickup: ${quote.pickupLocation}`,
    `Drop-off: ${quote.dropoffLocation}`,
    `Details: ${quote.details}`,
  ].join("\n");
};

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: usePostgres ? "postgres" : "sqlite",
  });
});

app.post("/api/quotes", async (req, res) => {
  const quote = {
    fullName: trimValue(req.body.fullName),
    phone: trimValue(req.body.phone),
    email: trimValue(req.body.email),
    serviceType: trimValue(req.body.serviceType),
    moveDate: trimValue(req.body.moveDate),
    pickupLocation: trimValue(req.body.pickupLocation),
    dropoffLocation: trimValue(req.body.dropoffLocation),
    details: trimValue(req.body.details),
  };

  if (
    !quote.fullName ||
    !quote.phone ||
    !quote.email ||
    !quote.serviceType ||
    !quote.pickupLocation ||
    !quote.dropoffLocation ||
    !quote.details
  ) {
    return res.status(400).json({
      error: "Missing required fields.",
    });
  }

  const quoteId = await insertQuote(quote);
  let smsStatus = "skipped";

  if (smsClient) {
    try {
      await smsClient.messages.create({
        messagingServiceSid: twilioMessagingServiceSid,
        to: twilioToNumber,
        body: formatSms(quote),
      });
      smsStatus = "sent";
    } catch (error) {
      smsStatus = "failed";
      console.error("Twilio send failed:", error);
    }
  }

  return res.status(201).json({
    success: true,
    id: quoteId,
    smsStatus,
  });
});

initPostgres()
  .then(() => {
    app.listen(port, () => {
      console.log(`Quote API running on http://localhost:${port}`);
      console.log(`Database mode: ${usePostgres ? "postgres" : "sqlite"}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });

process.on("SIGINT", () => {
  if (sqliteDb) {
    sqliteDb.close();
  }
  if (postgresPool) {
    postgresPool.end().finally(() => process.exit(0));
    return;
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (sqliteDb) {
    sqliteDb.close();
  }
  if (postgresPool) {
    postgresPool.end().finally(() => process.exit(0));
    return;
  }
  process.exit(0);
});
