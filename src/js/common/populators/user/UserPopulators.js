export const populateUser = user => ({
  id: user._id,
  preferName: user.preferName,
  email: user.email,
  ownedCourses: user.ownedCourses,
  involvedCourses: user.involvedCourses
});
