export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-bold text-white">
          RTS Pressure Washing & Transportation
        </a>

        <nav className="hidden gap-6 md:flex">
          <a href="#services" className="text-slate-300 hover:text-white">Services</a>
          <a href="#about" className="text-slate-300 hover:text-white">About</a>
          <a href="#quote" className="text-slate-300 hover:text-white">Quote</a>
        </nav>
      </div>
    </header>
  );
}