import Order from "../models/Order.js";
import axios from "axios";

export const createOrder = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      state,
      quantity,
      address,
    } = req.body;

    const order = await Order.create({
      fullname,
      phone,
      state,
      quantity,
      address,
    });

    await axios.post(
      `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`,
      {
        token: process.env.ULTRAMSG_TOKEN,

        to: phone,

        body: `Hello ${fullname},

Your order has been received successfully ✅

Quantity: ${quantity}

State: ${state}

Address:
${address}

Our delivery agent will contact you shortly.`,
      }
    );

    res.status(201).json({
      success: true,
      message: "Order submitted successfully",
      order,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const updateDeliveredStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.delivered = !order.delivered;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};