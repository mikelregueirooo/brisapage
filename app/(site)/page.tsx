import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import EventsSection from "@/components/home/EventsSection";
import InfoSection from "@/components/home/InfoSection";
import { getEvents } from "@/lib/events";
import { getVotes } from "@/lib/votes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "El Brisa — Donde el mar se convierte en fiesta",
  description:
    "Chiringuito de playa con los mejores eventos en directo de la costa. Música en vivo, DJ sets y ambiente único frente al mar.",
};

export default async function HomePage() {
  const events = await getEvents();

  // Fetch vote counts for all events in parallel
  const voteTotals = await Promise.all(
    events.map(async (e) => {
      const v = await getVotes(e.slug);
      return { slug: e.slug, total: v.yes + v.maybe + v.no };
    })
  );
  const voteMap = Object.fromEntries(voteTotals.map((v) => [v.slug, v.total]));

  return (
    <>
      <Hero />
      <EventsSection events={events} voteMap={voteMap} />
      <InfoSection />
    </>
  );
}
