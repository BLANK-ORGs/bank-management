import mongoose from "mongoose";


const guarantorSchema = new mongoose.Schema(
  {
    nic: {
      type: String,
    },
    guarantorCode: {
      type: String,
      unique: true,
      
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
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dldtrjalo/image/upload/v1728603263/hsx9le9olf5uayql3qfo.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const Guarantor = mongoose.model("Guarantor", guarantorSchema);

export default Guarantor;
