import mongoose from "mongoose";

const InstallmentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },
    date: {
      type: Date,
    },
    balance: {
      type: String,
    },

    description: {
      type: String,
    },
    collectedDate: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Reminded", "Finished"],
      default: "Pending",
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

const Installment = mongoose.model("Installment", InstallmentSchema);

export default Installment;
