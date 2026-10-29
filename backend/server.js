require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const fraudRoutes = require("./src/routes/fraudRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(express.urlencoded({ extended: false }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Cyber Fraud Portal API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API Information
|--------------------------------------------------------------------------
*/

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Cyber Fraud Portal API",
    version: "1.0.0",
  });
});

/*
|--------------------------------------------------------------------------
| Fraud Reports
|--------------------------------------------------------------------------
*/

app.use("/api/fraud-reports", fraudRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log("");
  console.log("================================");
  console.log(" Cyber Fraud Portal API");
  console.log("================================");
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log("================================");
});