import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "";

// interface Payload {
//   userId: string;
//   username: string;
// }

export default function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}
