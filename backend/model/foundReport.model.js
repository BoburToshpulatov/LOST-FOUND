import mongoose from "mongoose";

const foundReportSchema = new mongoose.Schema(
  {
    qrId: { type: mongoose.Schema.Types.ObjectId, ref: "QRCode" },
    finderName: { type: String, required: true },
    finderPhone: { type: String, required: true },
    email: { type: String, required: true },
    locationLink: { type: String }, // NEW
    createdAt: { type: Date, default: Date.now },
    rewardClaimed: { type: Boolean, default: false },
    confirmedByOwner: { type: Boolean, default: false },
    rewardCode: { type: String },
  },
  { timestamps: true }
);

export const FoundReport = mongoose.model("FoundReport", foundReportSchema);
