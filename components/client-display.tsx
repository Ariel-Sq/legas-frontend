'use client';

interface ClientDisplayProps {
  data: {
    message: string;
    timestamp: string;
  };
}

export function ClientDisplay({ data }: ClientDisplayProps) {
  return (
    <div className="p-8 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-bold mb-4 text-foreground">ClientDisplay</h2>
      <div className="space-y-2">
        <p className="text-lg text-foreground">
          <span className="font-semibold">Mensaje:</span> {data.message}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Timestamp:</span> {data.timestamp}
        </p>
      </div>
    </div>
  );
}
