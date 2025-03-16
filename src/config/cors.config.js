import cors from "cors";

export const corsOptions = {
  // origin: process.env.CORS_ORIGIN,
  origin: "http://localhost",
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
};
