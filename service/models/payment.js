import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    date: {
      type: String,
    },
    balance: {
        type: String,
      },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment;", paymentSchema);

export default Payment;
