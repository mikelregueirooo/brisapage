import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import EventsSection from "@/components/home/EventsSection";
import InfoSection from "@/components/home/InfoSection";
import { getEvents } from "@/lib/events";
import { getVotes } from "@/lib/votes";

export const metadata: Metadata = {
  title: "El Brisa — Donde el mar se convierte en fiesta",
  description:
    "Chiringuito de playa con los mejores eventos en directo de la costa. Música en vivo, DJ sets y ambiente único frente al mar.",
};

export default function HomePage() {
  const events = getEvents();
  const voteMap = Object.fromEntries(
    events.map((e) => {
      const v = getVotes(e.slug);
      return [e.slug, v.yes + v.maybe + v.no];
    })
  );

  return (
    <>
      <Hero />
      <EventsSection events={events} voteMap={voteMap} />
      <InfoSection />
    </>
  );
}
