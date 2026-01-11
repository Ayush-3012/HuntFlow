import { TimelineEvent } from "../models/timelineEvent.model.js";
import { successResponse } from "../utils/response.util.js";

/**
 * INTERNAL USE ONLY
 * Create timeline event
 */
export const createTimelineEvent = async ({
  applicationId,
  type,
  payload = {},
}) => {
  if (!applicationId || !type) return;

  await TimelineEvent.create({
    applicationId,
    type,
    payload,
  });
};

/**
 * Get timeline for an application
 */
export const getApplicationTimeline = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      const error = new Error("applicationId is required");
      error.statusCode = 400;
      throw error;
    }

    const events = await TimelineEvent.find({ applicationId }).sort({
      createdAt: 1,
    });

    return res.status(200).json(successResponse("Timeline fetched", events));
  } catch (error) {
    next(error);
  }
};
