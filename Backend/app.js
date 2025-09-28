import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routers
import userRouter from "./router/user.route.js";
import customerRouter from "./router/customer.route.js";
import orderRouter from "./router/order.route.js";
import dashboardRoutes from "./router/dashboard.route.js";
import authRoutes from './router/auth.route.js';
import itemsRouter from "./router/items.route.js";
import invoiceRouter from "./router/ivoice.route.js";

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/items', itemsRouter);
app.use('/api/v1/invoices', invoiceRouter);

app.use("/api/v1", dashboardRoutes);


// http://localhost:5000/api/v1/users/register

export { app };
