import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    isRegistered: { type: Boolean, default: false },
    deposit: { type: Number, default: 1.0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDisabled: { type: Boolean, default: false },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoundReport" }],
  },
  { timestamps: true }
);

qrCodeSchema.pre("save", function (next) {
  if (this.deposit <= 0) {
    this.isDisabled = true;
  }
  next();
});

export const QRCode = mongoose.model("QRCode", qrCodeSchema);
