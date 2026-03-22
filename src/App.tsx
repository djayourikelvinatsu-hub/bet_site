import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { FreePicks } from "./components/FreePicks";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <FreePicks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
