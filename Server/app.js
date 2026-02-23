import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import ApiError from "./utils/ErrorHandeler.js";

const app = express();

/* ===========================
   ✅ CORS — FINAL WORKING VERSION
   =========================== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

/* ===========================
   Middlewares
   =========================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===========================
   Routes
   =========================== */
app.use("/api", router);

/* Test route */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ===========================
   Global Error Handler
   =========================== */
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;