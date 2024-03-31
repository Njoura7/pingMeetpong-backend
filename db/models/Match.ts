import mongoose, { Document } from "mongoose";

interface IMatch extends Document {
  name: string;
  code: string;
  place: string;
  date: Date;
}

const matchSchema = new mongoose.Schema<IMatch>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  place: { type: String, required: true },
  date: { type: Date, required: true },
});

const Match = mongoose.model<IMatch>("match", matchSchema);

export default Match;
