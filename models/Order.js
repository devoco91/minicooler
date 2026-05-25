import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    delivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);