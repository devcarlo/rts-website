export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-orange-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="inline-block rounded-full bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            Owner-Operated Delivery Solutions
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Reliable Appliance Delivery & Transportation Services
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-200">
            Dependable local delivery for appliances, freight, and select long-distance loads.
            Professional communication, careful handling, and straightforward pricing.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#quote"
              className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white"
            >
              Request a Quote
            </a>
            <a
              href="#services"
              className="rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white"
            >
              View Services
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
          <img
            src="/images/logo.png"
            alt="Rossy Transportation Services logo"
            className="w-full rounded-3xl bg-white object-cover"
          />
        </div>
      </div>
    </section>
  );
}