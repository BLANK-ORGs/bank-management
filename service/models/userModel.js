import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    surName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    nic: {
      type: String,
    },
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
    address: {
      type: String,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dldtrjalo/image/upload/v1728603263/hsx9le9olf5uayql3qfo.jpg",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.isPasswordMatched = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
