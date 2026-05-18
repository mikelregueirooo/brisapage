import { CalendarDays, Flame, Users } from "lucide-react";

interface Props {
  totalEvents: number;
  totalVotes: number;
  totalRegistrations: number;
}

interface CardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function Card({ label, value, icon: Icon, color }: CardProps) {
  return (
    <div
      className="card-surface p-5 flex items-center gap-4"
      role="figure"
      aria-label={`${label}: ${value}`}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18`, color }}
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>
      <div>
        <p
          className="font-mono-accent text-[10px] tracking-widest uppercase"
          style={{ color: "var(--color-text-faint)" }}
        >
          {label}
        </p>
        <p
          className="font-display text-3xl leading-none mt-0.5"
          style={{ color: "var(--color-text)" }}
        >
          {value.toLocaleString("es-ES")}
        </p>
      </div>
    </div>
  );
}

export default function StatsCards({ totalEvents, totalVotes, totalRegistrations }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <Card
        label="Eventos"
        value={totalEvents}
        icon={CalendarDays}
        color="var(--color-primary)"
      />
      <Card
        label="Votos totales"
        value={totalVotes}
        icon={Flame}
        color="var(--color-accent)"
      />
      <Card
        label="Inscritos"
        value={totalRegistrations}
        icon={Users}
        color="#60a5fa"
      />
    </div>
  );
}
