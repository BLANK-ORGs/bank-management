import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRoute.js";
import { handleError, notFound } from "./middlewares/errorHandler.js";
import { dbConnect } from "./config/dbConnect.js";
import path from "path";
import { fileURLToPath } from "url";
import { customerRouter } from "./routes/customerRoute.js";
import { areaRouter } from "./routes/areaRoute.js";
import { guarantorRouter } from "./routes/guarantorRoute.js";
import logger from "./config/logger.js";
import { LoanRouter } from "./routes/loanRoute.js";
import { settingRoute } from "./routes/settingRoute.js";
import { paymentRouter } from "./routes/paymentRoute.js";
import { userTaskRouter } from "./routes/userTaskRoute.js";
import { installmentRouter } from "./routes/installmentRoute.js";
dotenv.config();

const port = process.env.PORT || 3000;

dbConnect();
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});
// remove this after --------------------------------------------------------------------------------------------
// app.use((req, res, next) => {
//   setTimeout(next, 3000); // 3-second delay
// });
// remove this after --------------------------------------------------------------------------------------------

app.get("/", (req, res) => {
  logger.info("Handling root request");
  res.send("app is running");
});
app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/area", areaRouter);
app.use("/api/guarantor", guarantorRouter);
app.use("/api/loan", LoanRouter);
app.use("/api/setting", settingRoute);
app.use("/api/payment", paymentRouter);
app.use("/api/user-task", userTaskRouter);
app.use("/api/installment", installmentRouter);

app.get("/api/image/:image", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads/profile", req.params.image));
});

app.use(notFound);
app.use(handleError);

app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});
