import { FoundReport } from "../model/foundReport.model.js";
import { QRCode } from "../model/qrCode.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const submitReport = async (req, res) => {
  try {
    const { qrId } = req.params;
    const { finderName, finderPhone, email, locationLink } = req.body;

    const qr = await QRCode.findById(qrId).populate("owner");
    if (!qr || qr.isDisabled) {
      return res.status(400).json({ message: "Invalid or disabled QR code." });
    }

    const report = await FoundReport.create({
      qrId,
      finderName,
      finderPhone,
      email,
      locationLink,
    });

    qr.history.push(report._id);
    await qr.save();

    const reportLink = `https://${process.env.BASE_URL}/report/${report._id}`;

    await sendEmail({
      to: qr.owner.email,
      subject: "Your Lost Item May Have Been Found",
      html: `
        <p>Hi ${qr.owner.name || "there"},</p>
        <p>Someone has reported finding your item!</p>
        <p><strong>Finder's Name:</strong> ${finderName}</p>
        <p><strong>Phone:</strong> ${finderPhone}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Location:</strong> <a href="${locationLink}" target="_blank">View on Map</a></p>
        <p>You can view full details and confirm the report here:</p>
        <p><a href="${reportLink}" target="_blank">${reportLink}</a></p>
        <br/>
        <p>— FindMe Team</p>
      `,
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting report", error: err });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await FoundReport.findById(req.params.id).populate("qrId");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Error getting report1", error: err });
  }
};

export const getUserUnconfirmedReports = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Get all QR codes owned by the user
    const userQRCodes = await QRCode.find({ owner: userId }, "_id");
    const qrIds = userQRCodes.map((qr) => qr._id);

    // Step 2: Get only unconfirmed reports for those QR codes
    const reports = await FoundReport.find({
      qrId: { $in: qrIds },
      confirmedByOwner: false,
    }).populate("qrId");

    res.json({ message: "Unconfirmed reports fetched successfully", reports });
  } catch (err) {
    console.error("Error fetching unconfirmed reports:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch unconfirmed reports", error: err });
  }
};
