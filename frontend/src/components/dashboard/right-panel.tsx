import SuggestedStatus from "./suggested-status";
import RecentActivity from "./recent-activity";

export default function RightPanel() {
  return (
    <div className="space-y-6">
      <SuggestedStatus />
      <RecentActivity />
    </div>
  );
}
