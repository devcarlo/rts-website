import { services } from "../data/services";

export default function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-16 text-white">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
          Services
        </p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Delivery solutions tailored to your load
        </h2>
        <p className="mt-4 text-slate-300">
          From household appliances to contractor materials, RTS focuses on careful handling,
          dependable transport, and profitable route planning.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="text-4xl">{service.icon}</div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
                {service.badge}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-bold">{service.title}</h3>
            <p className="mt-3 text-slate-300">{service.description}</p>

            <div className="mt-5 rounded-2xl bg-slate-950 px-4 py-3 text-lg font-semibold text-orange-300">
              {service.price}
            </div>

            <ul className="mt-5 space-y-3 text-slate-200">
              {service.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-orange-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}