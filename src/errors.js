export class MaxAllowedValueError extends Error {
  constructor() {
    super("The limit exceeded. Maximum allowed number is 32767");
  }
}

export class CodeParsingError extends Error {
  constructor(code) {
    super(`Code Parsing error. Code '${code}' not found`);
  }
}

export class DestCodeParsingError extends CodeParsingError {
  constructor(code) {
    super(`Code Parsing error. Dest code '${code}' not found`);
  }
}

export class JumpCodeParsingError extends CodeParsingError {
  constructor(code) {
    super(`Code Parsing error. Jump code '${code}' not found`);
  }
}

export class CompCodeParsingError extends CodeParsingError {
  constructor(code) {
    super(`Code Parsing error. Comp code '${code}' not found`);
  }
}

export class ReadFileError extends Error {
  constructor(filePath) {
    super(`Error has occurred while reading the file path '${filePath}' `);
  }
}

export class WriteFileError extends Error {
  constructor(filePath) {
    super(`Error has occurred with writing the file path '${filePath}' `);
  }
}

export class ExtensionError extends Error {
  constructor(filePath) {
    super(`Fil must have '.asm' extension`);
  }
}
