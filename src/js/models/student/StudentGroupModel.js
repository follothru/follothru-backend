import { Schema, model } from "mongoose";
import { castObjectId } from "../../utils/UtilityFunctions";

const StudentGroupSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: String,
  students: [{ type: Schema.Types.ObjectId, ref: 'StudentModel' }]
});

StudentGroupSchema.statics.deleteStudentGroupById = function (id) {
  const studentGroupId = castObjectId(id);
  return this.deleteOne({ _id: studentGroupId }).exec();
}

export default model('StudentGroupModel', StudentGroupSchema);
