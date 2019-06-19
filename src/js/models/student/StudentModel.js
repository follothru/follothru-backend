import { Schema, model } from "mongoose";

const StudentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  preferName: String,
  email: String
});

export default model('StudentModel', StudentSchema);
