import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUserBase extends Document {
  username: string;
  password: string;
  avatar: string;
}

interface IUser extends IUserBase {
  friends: IUser[]; // Reference to other IUser documents
  sentRequests: IUser[]; // Reference to other IUser documents
  pendingRequests: IUser[]; // Reference to other IUser documents
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  avatar: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

userSchema.pre("save", async function (this: IUser, next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>("user", userSchema);

export default User;
