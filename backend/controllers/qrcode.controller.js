import { QRCode } from "../model/qrCode.model.js"; // Assuming you have the QRCode model

// 1. Admin generates batch of QR codes
export const generateQRCodes = async (req, res) => {
  try {
    const { quantity } = req.body; // Expecting a quantity field
    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Please specify a valid quantity." });
    }

    // Generate multiple QR codes
    const qrCodes = [];
    for (let i = 0; i < quantity; i++) {
      const qrCode = new QRCode({
        isRegistered: false,
        deposit: 1.0, // initial deposit
      });
      await qrCode.save();
      qrCodes.push(qrCode);
    }

    return res
      .status(201)
      .json({ message: "QR codes generated successfully", qrCodes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error generating QR codes" });
  }
};

// 2. Fetch QR code info (used when QR is scanned)
export const getQRCodeInfo = async (req, res) => {
  try {
    const { id } = req.params; // QR code id from URL
    const qrCode = await QRCode.findById(id).populate({
      path: "owner",
      select: "name email phone backupPhone", // list only the fields you want
    });

    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    if (qrCode.isDisabled) {
      return res.status(200).json({ message: "QR code is disabled", qrCode });
    }

    if (!qrCode.isRegistered) {
      return res
        .status(200)
        .json({ message: "Please register this QR code.", qrCode });
    }

    return res.status(200).json({
      message: "QR code found",
      qrCode,
      owner: qrCode.owner, // send owner details if registered
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching QR code info" });
  }
};

// 3. Register QR code to logged-in user
export const registerQRCode = async (req, res) => {
  try {
    const { id } = req.params; // QR code id from URL
    const user = req.user; // Assuming you have user info from the JWT auth middleware

    // Find the QR code
    const qrCode = await QRCode.findById(id);

    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    if (qrCode.isRegistered) {
      return res.status(400).json({ message: "QR code already registered" });
    }

    // Register the QR code to the user
    qrCode.isRegistered = true;
    qrCode.owner = user._id;
    await qrCode.save();

    return res
      .status(200)
      .json({ message: "QR code registered successfully", qrCode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error registering QR code" });
  }
};

// 4. Disable QR code (e.g., after deposit is depleted)
export const disableQRCode = async (req, res) => {
  try {
    const { id } = req.params; // QR code id from URL

    // Find the QR code
    const qrCode = await QRCode.findById(id);

    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    // Disable the QR code if the deposit is 0
    if (qrCode.deposit <= 0) {
      qrCode.isDisabled = true;
      await qrCode.save();
      return res
        .status(200)
        .json({ message: "QR code disabled due to no deposit" });
    }

    return res.status(400).json({ message: "Deposit is not depleted yet" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error disabling QR code" });
  }
};
