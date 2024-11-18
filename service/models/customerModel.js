import mongoose from "mongoose";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      unique: true,
    },
    nic: {
      type: String,
    },
    areaCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    location: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    surName: {
      type: String,
    },
    address: {
      type: String,
    },
    number: [
      {
        type: String,
      },
    ],
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: String,
    },
    civilStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    income: {
      type: String,
      enum: [
        "0-20000",
        "20000-40000",
        "40000-60000",
        "60000-80000",
        "80000-100000",
        "above 100000",
      ],
    },
    homeFullIncome: {
      type: String,
      enum: ["0-50000", "50000-100000", "above 100000"],
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dldtrjalo/image/upload/v1728603263/hsx9le9olf5uayql3qfo.jpg",
    },
    homeImage: {
      type: String,
    },
    billImage: {
      type: String,
    },
    paySheetImage: {
      type: String,
    },
    signatureImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
