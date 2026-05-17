import { ProgressDisplay } from "@/components/checkins/progress-display";

export default function CheckinsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Check-ins</h1>
        <p className="text-muted-foreground">
          Review your progress score.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Current Progress</h2>

        <ProgressDisplay
          score={82}
          showLabel={true}
          size="lg"
        />
      </div>
    </div>
  );
}