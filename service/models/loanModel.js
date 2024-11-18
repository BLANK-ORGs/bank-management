import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    location: {
      type: String,
    },
    loanCode: {
      type: String,
    },
    customerCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    guarantorCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guarantor",
    },
    loanDuration: {
      type: Number,
    },
    ofInstallments: {
      type: Number,
    },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    collectWeek: {
      type: String,
    },
    collectDay: {
      type: String,
    },
    loanAmount: {
      type: Number,
    },
    interestRate: {
      type: Number,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    reminderDescription: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Finished"],
      default: "Pending",
    },
    action: {
      description: {
        type: String,
      },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Finished"],
      },
      image: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Loan = mongoose.model("Loan", LoanSchema);

export default Loan;
