export const validateRequest = (schemas = {}) => {
  return (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      next();
    } catch (error) {
      if (error?.name === "ZodError") {
        const details = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          details,
        });
      }

      next(error);
    }
  };
};
