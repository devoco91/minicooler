import express from "express";

import {
  createOrder,
  getOrders,
  updateDeliveredStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/", getOrders);

router.patch("/:id/delivered", updateDeliveredStatus);

router.delete("/:id", deleteOrder);

export default router;