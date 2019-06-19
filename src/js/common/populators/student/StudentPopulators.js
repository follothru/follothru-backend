export const populateStudent = student => {
  const { _id, preferName, email } = student;
  return { id: _id, preferName, email };
};
