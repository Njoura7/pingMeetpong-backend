import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  login(username: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (username: string, password: string) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect username");
};

const User: IUserModel = mongoose.model<IUser, IUserModel>("user", userSchema);

export default User;
