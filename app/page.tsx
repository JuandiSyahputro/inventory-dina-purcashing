import { About } from "@/components/home/about-us";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { Navigation } from "@/components/home/navigation";
import { Services } from "@/components/home/services";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <About />
      <Features />
      <Services />
      {/* <Team />
      <Pricing />
      <Testimonials />
      <Contact /> */}
      <Footer />
    </main>
  );
}
