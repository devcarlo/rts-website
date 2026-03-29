export default function AboutOwnerSection() {
  return (
    <section id="about" className="border-y border-slate-800 bg-slate-900/60 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
            About the Owner
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Professional, reliable, and hands-on
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            RTS Pressure Washing & Transportation is built around responsive service,
            dependable work, and strong communication. As an owner-operated business,
            every job is handled with professionalism and care.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Owner oversight on deliveries",
              "Reliable communication",
              "Flexible local service",
              "Straightforward quote process",
            ].map((item) => (
              <div key={item} className="rounded-xl bg-slate-950 px-4 py-3 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="aspect-[4/5] w-full bg-slate-800">
            <img
              src="/images/Owner-Transportation.png"
              alt="Owner of Rossy Transportation Services"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold">Owner & Operator</h3>
            <p className="mt-2 text-lg font-semibold text-orange-300">Franco Rossy</p>
            <p className="mt-1 text-slate-200">813-809-9840</p>
            <p className="mt-2 text-slate-300">
              Dedicated to building a trusted local brand focused on pressure washing,
              transport support, and customer-first service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}