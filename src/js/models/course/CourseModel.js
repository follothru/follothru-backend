import { Schema, model } from "mongoose";
import StudentGroupModel from "../student/StudentGroupModel";
import { castObjectId } from "../../utils/UtilityFunctions";

const CourseSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: String,
  studentGroup: { type: Schema.Types.ObjectId, ref: 'StudentGroupModel' }
});

CourseSchema.statics.deleteCourseById = function (id) {
  const courseId = castObjectId(id);
  return this.findOneAndDelete({ _id: courseId }, function (err, deletedCourse) {
    if (err) {
      console.error(err);
      return;
    }

    if (!deletedCourse) {
      return;
    }

    const { studentGroup } = deletedCourse;
    StudentGroupModel.deleteStudentGroupById(studentGroup);
  });
}

CourseSchema.pre('save', function (next) {
  const { name } = this;
  const studentGroup = new StudentGroupModel({ name: `${name}_StudentGroup` });
  this.studentGroup = studentGroup._id;
  studentGroup.save();
  next();
});

export default model('CourseModel', CourseSchema);
