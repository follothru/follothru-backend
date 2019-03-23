module.exports = (() => {
  const UserGroup = {
    ANONYMOUS: 0,
    INSTRUCTOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
    toString: group => {
      switch (group) {
        case UserGroup.SUPER_ADMIN:
          return 'SUPER_ADMIN';
        case UserGroup.ADMIN:
          return 'ADMIN';
        case UserGroup.INSTRUCTOR:
          return 'INSTRUCTOR';
      }
      return 'ANONYMOUS';
    }
  };
  return { UserGroup };
})();
