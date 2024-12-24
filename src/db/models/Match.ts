import mongoose, { Document } from "mongoose";
import "./User"; 

interface IMatch extends Document {
  name: string;
  code: string;
  place: string;
  date: Date;
  score:string;
  owner: mongoose.Types.ObjectId; // Reference to User model for the owner
  players: mongoose.Types.ObjectId[]; // Array of references to User model for the players
}

const matchSchema = new mongoose.Schema<IMatch>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  place: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: String},
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Match = mongoose.model<IMatch>("match", matchSchema);

export default Match;