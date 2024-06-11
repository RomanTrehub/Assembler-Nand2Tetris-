const number = "^@[0-9]+$";
const compDestJumpCode = "^[A-Z]+={1}[A-Z0!-|&1+]+;{1}[A-Z]+$";
const compDest = "^[A-Z]+={1}[A-Z0!-|&1+]+$";
const compJump = "^[A-Z0!-|&1+]+;{1}[A-Z]+$";
const variable = "^(@[a-zA-Z]).*$";

export const NUMBER_CODE_REGEX = new RegExp(number);
export const COMP_DEST_JUMP_CODE_REGEX = new RegExp(compDestJumpCode);
export const COMP_DEST_CODE_REGEX = new RegExp(compDest);
export const COMP_JUMP_CODE_REGEX = new RegExp(compJump);
export const VAR_CODE_REGEXP = new RegExp(variable);
export const VALID_CODE = new RegExp(
  `(${variable})|(${compDestJumpCode})|(${compDest})|(${compJump}|${number})`
);
