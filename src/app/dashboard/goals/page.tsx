import { WeightageIndicator } from "@/components/goals/weightage-indicator";

export default function GoalsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Goals</h1>
        <p className="text-muted-foreground">
          Track your goal weightage and completion.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Weightage Overview</h2>

        <WeightageIndicator
          current={75}
          required={100}
          goalCount={4}
          maxGoals={5}
        />
      </div>
    </div>
  );
}