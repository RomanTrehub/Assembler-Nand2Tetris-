import {
  COMP_DEST_CODE_REGEX,
  COMP_DEST_JUMP_CODE_REGEX,
  COMP_JUMP_CODE_REGEX,
} from "./constants/codeRegexps.js";
import { MAX_A_INSTRUCTION_VALUE } from "./constants/maxAInstructionValue.js";
import {
  CodeParsingError,
  CompCodeParsingError,
  DestCodeParsingError,
  JumpCodeParsingError,
  MaxAllowedValueError,
} from "./errors.js";

export default class Code {
  #destCodes = new Map([
    ["M", "001"],
    ["D", "010"],
    ["DM", "011"],
    ["A", "100"],
    ["AM", "101"],
    ["AD", "110"],
    ["ADM", "111"],
  ]);

  #jumpCodes = new Map([
    ["JGT", "001"],
    ["JEQ", "010"],
    ["JGE", "011"],
    ["JLT", "100"],
    ["JNE", "101"],
    ["JLE", "110"],
    ["JMP", "111"],
  ]);

  #compCodes = new Map([
    ["0", "0101010"],
    ["1", "0111111"],
    ["-1", "0111010"],
    ["D", "0001100"],
    ["A", "0110000"],
    ["!D", "0001101"],
    ["!A", "0110001"],
    ["-D", "0001111"],
    ["-A", "0110011"],
    ["D+1", "0011111"],
    ["A+1", "0110111"],
    ["D-1", "0001110"],
    ["A-1", "0110010"],
    ["D+A", "0000010"],
    ["D-A", "0010011"],
    ["A-D", "0000111"],
    ["D&A", "0000000"],
    ["D|A", "0010101"],
    ["M", "1110000"],
    ["!M", "1110001"],
    ["-M", "1110011"],
    ["M+1", "1110111"],
    ["M-1", "1110010"],
    ["D+M", "1000010"],
    ["D-M", "1010011"],
    ["M-D", "1000111"],
    ["D&M", "1000000"],
    ["D|M", "1010101"],
  ]);

  #matchDestCode(code) {
    const foundDest = code.match(/[A-Z]+={1}/);
    const sortedCode = foundDest[0]
      .slice(0, foundDest[0].length - 1)
      .split("")
      .sort()
      .join("");
    const foundDestCode = this.#destCodes.get(sortedCode);
    if (!foundDestCode) {
      throw new DestCodeParsingError(sortedCode);
    }
    return foundDestCode;
  }

  #matchJumpCode(code) {
    const jumpCode = code.match(/;{1}[A-Z]+/)[0].slice(1);
    const foundJumpCode = this.#jumpCodes.get(jumpCode);
    if (!foundJumpCode) {
      throw new JumpCodeParsingError(jumpCode);
    }
    return foundJumpCode;
  }

  #matchCompCode(code) {
    let compCode = code.match(/[A-Z0!\-|&1+]+;{1}/);
    if (compCode) {
      compCode = compCode[0].slice(0, compCode[0].length - 1);
    } else {
      compCode = code.match(/={1}[A-Z0!\-|&1+]+/)[0].slice(1);
    }
    const foundCompCode = this.#compCodes.get(compCode);
    if (!foundCompCode) {
      throw new CompCodeParsingError(compCode);
    }
    return foundCompCode;
  }

  #createBinaryCodeFromNumb(code) {
    const number = Number(code);
    if (number > MAX_A_INSTRUCTION_VALUE) {
      throw new MaxAllowedValueError();
    }
    const binaryString = number.toString(2);

    return "0" + "0".repeat(15 - binaryString.length) + binaryString + "\n";
  }

  convertToBinaryCode(code) {
    if (!isNaN(code)) {
      return this.#createBinaryCodeFromNumb(code);
    }
    let dest = "000";
    let jump = "000";
    let comp = null;

    if (code.search(COMP_DEST_JUMP_CODE_REGEX) > -1) {
      dest = this.#matchDestCode(code);
      jump = this.#matchJumpCode(code);
      comp = this.#matchCompCode(code);
    } else if (code.search(COMP_DEST_CODE_REGEX) > -1) {
      dest = this.#matchDestCode(code);
      comp = this.#matchCompCode(code);
    } else if (code.search(COMP_JUMP_CODE_REGEX) > -1) {
      comp = this.#matchCompCode(code);
      jump = jump = this.#matchJumpCode(code);
    } else {
      throw new CodeParsingError(code);
    }

    return "111" + comp + dest + jump + "\n";
  }
}
