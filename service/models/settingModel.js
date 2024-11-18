import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    interestRate: [
      {
        rate: {
          type: Number,
        },
      },
    ],
    days: [
      {
        day: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
