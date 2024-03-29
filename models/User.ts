import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 7 },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>("user", userSchema);

export default User;
