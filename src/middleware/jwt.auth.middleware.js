import jwt from "jsonwebtoken";
import ApplicationLevelError from "../custom.error.logs.reponses/application.level.error.js";

export const jwtValidation = (req, res, next) => {
  let token = req.get("authorization");

  if (!token) {
    throw new ApplicationLevelError(
      "Forbidden resource",
      404,
      "No token is present in the request",
      "Bad Request"
    );
  } else {
    try {
      let result = jwt.verify(token, process.env.JWT_SECRET);
      req.payload = {
        name: result.name,
        user_id: result.user_id,
        email: result.email,
      };
      next();
    } catch (error) {
      throw new ApplicationLevelError(
        error.message || "data base error",
        error.status_code || 500,
        error.error_message || error.message,
        error.error_type || "Data Base Error"
      );
    }
  }
};
