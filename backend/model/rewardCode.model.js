import mongoose from "mongoose";

const rewardCodeSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    qrId: { type: mongoose.Schema.Types.ObjectId, ref: "QRCode" },
    foundReport: { type: mongoose.Schema.Types.ObjectId, ref: "FoundReport" },
    finderPhone: String,
    founderName: String,
    amount: Number,
    isClaimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RewardCode = mongoose.model("RewardCode", rewardCodeSchema);
