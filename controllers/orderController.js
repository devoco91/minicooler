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

    // Save order first
    const order = await Order.create({
      fullname,
      phone,
      state,
      quantity,
      address,
    });

    // Try sending WhatsApp message
    // If it fails, the order will still be successful
    try {
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
        },
        {
          timeout: 10000,
        }
      );

      console.log(`WhatsApp sent to ${phone}`);
    } catch (whatsappError) {
      console.error(
        "WhatsApp failed:",
        whatsappError.response?.data || whatsappError.message
      );

      // Don't stop order creation if WhatsApp fails
    }

    return res.status(201).json({
      success: true,
      message: "Order submitted successfully",
      order,
    });

  } catch (error) {
    console.error(
      "Create order error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to submit order",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const updateDeliveredStatus = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};