import aj from "./lib/arcjet.js";

import { isSpoofedBot } from "@arcjet/inspect";


export const arcjetMiddleware = async (req, res, next) => {

    try {
        const decision = await aj.protect(req);

        if (decision.isDenied) {

            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too many requests, please try again later." });
            }


            else if (decision.reason.isBot) {
                return res.status(403).json({ message: " bot Access denied." });
            }

            else {
                return res.status(403).json({ message: "Access denied by security policy." });
            }
        }

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ message: "Access denied, spoofed bot detected." });
        }

        next();


    } catch (error) {
        console.error("Error in Arcjet middleware:", error);
        if(process.env.NODE_ENV === 'production'){
            return res.status(500).json({ message: "Internal server error." });
        }
        next();

    }
}