import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { QRCode } from "../model/qrCode.model.js";

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
  try {
    const { email, password, phone, backupPhone, name } = req.body;

    if (!email || !password || !phone || !backupPhone || !name)
      return res.status(400).json({ message: "All fields are required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user = new User({
      email,
      password: hashedPassword,
      phone,
      backupPhone,
      name,
      verified: false,
      verificationCode: {
        code,
        expiresAt: expires,
      },
    });

    await user.save();

    await sendEmail({
      to: email,
      subject: `🔐 Verify Your Email, ${name}`,
      html: `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; border-radius: 8px; color: #333; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4CAF50; text-align: center;">Welcome to Lost&Found, ${name}!</h2>
          <p style="font-size: 16px;">To complete your registration, please verify your email using the code below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 26px; font-weight: bold; background: #e8f5e9; color: #2e7d32; padding: 12px 24px; border-radius: 6px; letter-spacing: 4px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px;">This code will expire in 10 minutes. If you didn’t sign up, you can ignore this email.</p>
        </div>
      `,
      replyTo: "bobur.vocal@gmail.com",
    });

    res.status(200).json({
      success: true,
      user,
      message:
        "Verification code sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });

    const user = await User.findOne({ email });
    if (!user || !user.verificationCode)
      return res.status(400).json({ message: "Invalid verification attempt" });

    const isExpired = user.verificationCode.expiresAt < new Date();

    if (user.verificationCode.code !== code || isExpired) {
      return res.status(401).json({ message: "Invalid or expired code" });
    }

    user.verified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, message: "Email verified successfully", token });
  } catch (err) {
    console.error("Email verification failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = {
      code,
      expiresAt: expires,
    };

    await user.save();

    await sendEmail({
      to: email,
      subject: `🔐 Verify Your Email Again`,
      html: `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; border-radius: 8px; color: #333;">
          <h2 style="color: #4CAF50; text-align: center;">Resend Verification</h2>
          <p>Your new verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #2e7d32; background-color: #e8f5e9; padding: 10px 20px; border-radius: 5px; display: inline-block;">${code}</div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
      replyTo: "bobur.vocal@gmail.com",
    });

    res
      .status(200)
      .json({ success: true, message: "Verification code re-sent" });
  } catch (err) {
    console.error("Resend verification failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const requestLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    if (!user.verified)
      return res.status(403).json({
        message: "Your account is not verified. Please verify your email first",
      });

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = { code, expiresAt: expires };
    await user.save();

    await sendEmail({
      to: email,
      subject: "🔐 Your LOST&FOUND Login Code",
      html: `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; border-radius: 8px; color: #333; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #4CAF50; text-align: center;">Your Login Code</h2>
          <p style="font-size: 16px;">Use the code below to log in to your LOST&FOUND account:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; background: #e8f5e9; color: #2e7d32; padding: 12px 24px; border-radius: 6px; letter-spacing: 4px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px;">This code will expire in 10 minutes. If you didn’t request it, you can ignore this email.</p>
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
            Need help? Contact us at <a href="mailto:support@lost&found.com">support@lost&found.com</a><br/>
            © ${new Date().getFullYear()} LOST&FOUND
          </p>
        </div>
      `,
      replyTo: "bobur.vocal@gmail.com",
    });

    res.status(200).json({ success: true, message: "Login code sent" });
  } catch (err) {
    console.error("Login request failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyLoginCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });

    const user = await User.findOne({ email });
    if (!user || !user.verificationCode)
      return res.status(400).json({ message: "Invalid login attempt" });

    const isExpired = user.verificationCode.expiresAt < new Date();

    if (user.verificationCode.code !== code || isExpired) {
      return res.status(401).json({ message: "Invalid or expired code" });
    }

    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login verification failed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const qrCodes = await QRCode.find({ owner: id }); // Find QR codes owned by the userqrCodes

    res.json({ user, qrCodes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, name, phone, backupPhone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email, name, phone, backupPhone },
      {
        new: true,
      }
    );
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
