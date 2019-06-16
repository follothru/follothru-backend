import validator from 'validator';
import { ParameterEmptyError } from '../common/errors';

const isEmpty = param => {
  if (param instanceof String) {
    return validator.isEmpty(param);
  }
  if (param instanceof Array) {
    return param.length <= 0;
  }
  if (!param) {
    return true;
  }
  return false;
};

export const notEmpty = (param, name) => {
  if (isEmpty(param)) {
    throw new ParameterEmptyError(`'${name}' should not be empty.`);
  }
};
