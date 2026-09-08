import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayInstance = null;

export function getRazorpayClient() {
  if (razorpayInstance) return razorpayInstance;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials are not configured in environment variables.");
  }

  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });

  return razorpayInstance;
}

export function verifyRazorpaySignature(orderId, paymentId, signature) {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) return false;

  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}
