export const suggestStatusFromTimeline = (timelineEvents, currentStatus) => {
  if (!timelineEvents || timelineEvents.length === 0) return null;

  if (["Selected", "Rejected"].includes(currentStatus)) {
    return null;
  }

  for (let i = timelineEvents.length - 1; i >= 0; i--) {
    const event = timelineEvents[i];

    if (event.type === "MAIL_SENT" && currentStatus === "Saved") {
      return {
        status: "Applied",
        reason: "Application email was sent",
      };
    }

    if (event.type === "MAIL_RECEIVED" && currentStatus === "Applied") {
      return {
        status: "Shortlisted",
        reason: "Recruiter replied to your application email",
      };
    }
  }

  return null;
};
