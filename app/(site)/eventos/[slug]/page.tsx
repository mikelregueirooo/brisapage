import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/events";
import EventHero from "@/components/event/EventHero";
import EventDetails from "@/components/event/EventDetails";
import VoteSection from "@/components/event/VoteSection";
import SignupSection from "@/components/event/SignupSection";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Evento no encontrado" };

  const formattedDate = new Date(event.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    title: `${event.artist} — ${event.title}`,
    description: `${event.description} ${formattedDate} en ${event.venue}.`,
    openGraph: {
      title: `${event.artist} — ${event.title} | El Brisa`,
      description: event.description,
      images: [{ url: event.imageUrl, width: 800, height: 600, alt: `${event.artist} en El Brisa` }],
    },
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />
      <EventDetails event={event} />
      {event.allowsRegistration && <SignupSection slug={event.slug} />}
      <VoteSection slug={event.slug} />
    </>
  );
}
