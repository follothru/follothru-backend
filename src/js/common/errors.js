export const types = {
  PARAMETER_EMPTY_ERROR: 'PARAMETER_EMPTY_ERROR',
  INVALID_PARAMETER_ERROR: 'INVALID_PARAMETER_ERROR',
  DOCUMENT_NOT_FOUND_ERROR: 'DOCUMENT_NOT_FOUND'
};

export class ParameterEmptyError extends Error {
  constructor(message) {
    super(message);
    this.type = types.PARAMETER_EMPTY_ERROR
  }
};

export class InvalidParameterError extends Error {
  constructor(message) {
    super(message);
    this.type = types.INVALID_PARAMETER_ERROR
  }
};

export class DocumentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.type = types.DOCUMENT_NOT_FOUND_ERROR
  }
};
