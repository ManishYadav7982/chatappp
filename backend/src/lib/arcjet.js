import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.ARCJET_KEY) {
  throw new Error("ARCJET_KEY missing in .env");
}

const MODE = process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: MODE,
    }),

    detectBot({
      mode: MODE,
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    slidingWindow({
      mode: MODE,
      interval: 60, //  seconds
      max: 100,     //  requests per interval
    }),
  ],
});

export default aj;
