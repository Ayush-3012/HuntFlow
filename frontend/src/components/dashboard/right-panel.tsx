import SuggestedStatus from "./suggested-status";
import RecentActivity from "./recent-activity";
import { Application } from "@/types/application";

type Props = {
  applications: Application[];
};

export default function RightPanel({ applications }: Props) {
  return (
    <div className="space-y-6">
      <SuggestedStatus applications={applications} />
      <RecentActivity applications={applications} />
    </div>
  );
}
