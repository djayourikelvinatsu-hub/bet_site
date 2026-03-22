import { Hero } from "../components/Hero";
import { Stats } from "../components/Stats";
import { TrackRecord } from "../components/TrackRecord";
import { FreePicks } from "../components/FreePicks";
import { Testimonials } from "../components/Testimonials";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";

export function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <TrackRecord />
      <FreePicks />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>
  );
}
