import { ColdMessage } from "../models/message.model.js";
import { successResponse } from "../utils/response.util.js";

export const listMessages = async (req, res, next) => {
  try {
    const { applicationId } = req.query;
    const filter = {};

    if (applicationId) {
      filter.applicationId = applicationId;
    }

    const messages = await ColdMessage.find(filter)
      .populate({
        path: "applicationId",
        populate: [{ path: "jobId" }, { path: "versionId" }],
      })
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json(successResponse("Cold messages fetched", messages));
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const message = await ColdMessage.findById(req.params.id).populate({
      path: "applicationId",
      populate: [{ path: "jobId" }, { path: "versionId" }],
    });

    if (!message) {
      const error = new Error("Cold message not found");
      error.statusCode = 404;
      throw error;
    }

    return res
      .status(200)
      .json(successResponse("Cold message fetched", message));
  } catch (error) {
    next(error);
  }
};
