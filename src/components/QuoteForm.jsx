import { useState } from "react";

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  serviceType: "Appliance Delivery",
  moveDate: "",
  pickupLocation: "",
  dropoffLocation: "",
  details: "",
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const quoteEndpoint = apiBaseUrl ? `${apiBaseUrl}/api/quotes` : "/api/quotes";

export default function QuoteForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(quoteEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit quote request right now.");
      }

      setSuccessMessage(
        payload.smsStatus === "failed"
          ? "Quote saved, but text notification failed. We will still follow up shortly."
          : "Quote request submitted successfully. We'll contact you shortly."
      );
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quote" className="mx-auto max-w-7xl px-6 py-16 text-white">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
          Request a Quote
        </p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Tell us about your delivery needs
        </h2>
        <p className="mt-4 text-slate-300">
          Fill out the form below to request a quote for appliance delivery, local freight,
          or long-distance loads.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />

            <select
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            >
              <option>Pressure Washing</option>
              <option>Appliance Delivery</option>
              <option>Local Freight / Store Delivery</option>
              <option>Pallet / Long-Distance Load</option>
            </select>

            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              type="date"
              name="moveDate"
              value={formData.moveDate}
              onChange={handleChange}
            />
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Pickup Location"
              required
            />
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
              type="text"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              placeholder="Drop-off Location"
              required
            />

            <textarea
              rows="5"
              placeholder="Load details, number of items, stairs, dimensions, distance, or handling notes"
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 md:col-span-2"
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
            />
          </div>

          {errorMessage ? <p className="mt-4 text-sm text-red-300">{errorMessage}</p> : null}
          {successMessage ? <p className="mt-4 text-sm text-green-300">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-6">
            <h3 className="text-xl font-bold">Estimated Pricing</h3>

            <div className="mt-4 space-y-4 text-slate-200">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="font-semibold">Appliance Delivery</div>
                <div className="text-orange-300">$120 – $250 per delivery</div>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="font-semibold">Local Freight / Store Deliveries</div>
                <div className="text-orange-300">$80 – $150 per stop</div>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="font-semibold">Pallet & Long-Distance Loads</div>
                <div className="text-orange-300">$1.50 – $2.50+ per mile</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}