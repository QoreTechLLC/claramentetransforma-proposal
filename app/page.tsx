import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Purpose from "@/components/Purpose";
import Services from "@/components/Services";
import BookingWidget from "@/components/BookingWidget";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Purpose />
      <Services />
      <BookingWidget />
      <Testimonials />
      <Footer />
    </main>
  );
}
