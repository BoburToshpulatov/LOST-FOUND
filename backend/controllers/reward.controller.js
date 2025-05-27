import { FoundReport } from "../model/foundReport.model.js";
import { QRCode } from "../model/qrCode.model.js";
import { RewardCode } from "../model/rewardCode.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const confirmFound = async (req, res) => {
  try {
    const report = await FoundReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.confirmedByOwner) {
      return res.status(400).json({ message: "Already confirmed" });
    }

    const qr = await QRCode.findById(report.qrId);
    qr.deposit -= 0.5;
    await qr.save();
    const amount = 0.5;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const reward = await RewardCode.create({
      code,
      qrId: report.qrId,
      foundReport: report._id,
      finderPhone: report.finderPhone,
      finderEmail: report.email,
      amount,
    });

    report.confirmedByOwner = true;
    report.rewardCode = code;
    await report.save();

    // Attempt to create a pseudo-email using phone

    await sendEmail({
      to: report.email, // Ideally you'd collect real email from finder
      subject: "🎉 You've received a reward!",
      html: `
        <h2>Your found item was confirmed!</h2>
        <p>Thank you, <strong>${
          report.finderName
        }</strong>, for reporting the lost item.</p>
        <p>Here's your reward code: <strong style="font-size: 1.5em;">${code}</strong></p>
        <p>Reward Amount: <strong>$${amount.toFixed(2)}</strong></p>
        <p><a href="${
          report.locationLink
        }" target="_blank">📍 View Location</a></p>
        <p>Thank you for being a kind citizen 🙏</p>
      `,
    });

    res.json({ success: true, message: "Confirmed and reward issued", reward });
  } catch (err) {
    console.error("Confirm found error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error confirming report", error: err });
  }
};
