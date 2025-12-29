import { successResponse } from "../utils/response.util.js";

export const healthController = async (req, res) => {
  const data = {
    service: "huntflow-backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  const response = successResponse("Service is healthy", data);

  return res.status(200).json(response);
};
