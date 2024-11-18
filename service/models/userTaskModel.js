import mongoose from "mongoose";

const userTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    installmentId: {
      type: String,
    },
    customerCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    address: {
      type: String, 
    },
    date: {
      type: Date,
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed" , "cancelled"],
      default: "pending",
    },
    statusDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);



const UserTask = mongoose.model("UserTask", userTaskSchema);

export default UserTask;
