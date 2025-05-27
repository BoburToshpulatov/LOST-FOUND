import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { aj } from "./lib/arcjet.js";
import { connectDB } from "./config/db.js";
import authRouter from "./routers/auth.route.js";
import qrCodeRouter from "./routers/qr-code.route.js";
import reportsRouter from "./routers/foundReport.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "*" }));

// app.use(async (req, res, next) => {
//   try {
//     const decison = await aj.protect(req, {
//       requested: 1, // specifies that each request consumes one token
//     });

//     if (decison.isDenied()) {
//       if (decison.reason.isRateLimit()) {
//         res.status(429).json({ success: false, message: "Too Many Requests" });
//       }
//       if (decison.reason.isBot()) {
//         res.status(403).json({ success: false, message: "Bot access denied" });
//       } else {
//         res.status(403).json({ success: false, message: "Forbidden" });
//       }
//       return;
//     }

// check for spoofed bots
//     if (
//       decison.results.some(
//         (result) => result.reason.isBot() && result.reason.isSpoofed()
//       )
//     ) {
//       res.status(403).json({ success: false, message: "Spoofed bot detected" });
//       return;
//     }

//     next();
//   } catch (error) {
//     console.log("Arcjet error", error);
//     next(error);
//   }
// });

app.use("/api/auth", authRouter);
app.use("/api/qr-code", qrCodeRouter);
app.use("/api/reports", reportsRouter);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "dist");

  app.use(express.static(frontendPath));

  app.use((req, res, next) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
