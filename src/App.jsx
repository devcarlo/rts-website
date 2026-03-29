import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import AboutOwnerSection from "./components/AboutOwnerSection";
import QuoteForm from "./components/QuoteForm";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutOwnerSection />
      <QuoteForm />
      <Footer />
    </div>
  );
}