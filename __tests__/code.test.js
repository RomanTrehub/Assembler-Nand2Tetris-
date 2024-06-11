import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import {
  CodeParsingError,
  CompCodeParsingError,
  DestCodeParsingError,
  JumpCodeParsingError,
  MaxAllowedValueError,
} from "../src/errors.js";
import Code from "../src/code.js";

describe("Code", () => {
  const code = new Code();

  it("should return A instruction", () => {
    const numbers = ["32767", "0", "255"];
    const binaryNumbers = [
      "0111111111111111",
      "0000000000000000",
      "0000000011111111",
    ];

    numbers.forEach((number, i) => {
      const binaryInstructionCode = code.convertToBinaryCode(number);
      strictEqual(binaryInstructionCode, `${binaryNumbers[i]}\n`);
    });
  });

  it("should return a max allowed error", () => {
    const number = "32768";
    try {
      code.convertToBinaryCode(number);
    } catch (err) {
      strictEqual(err instanceof MaxAllowedValueError, true);
    }
  });

  it("should return C instruction", () => {
    const instructions = ["0;JMP", "AMD=D-1", "A=!M;JLT"];
    const binaryInstructions = [
      "1110101010000111",
      "1110001110111000",
      "1111110001100100",
    ];

    instructions.forEach((instruction, i) => {
      const binaryInstructionCode = code.convertToBinaryCode(instruction);
      strictEqual(binaryInstructionCode, `${binaryInstructions[i]}\n`);
    });
  });

  it("should return code parsing error", () => {
    try {
      code.convertToBinaryCode("asdas=asdasd;asdasd");
    } catch (err) {
      strictEqual(err instanceof CodeParsingError, true);
    }
  });

  it("should return JUMP code parsing error", () => {
    try {
      code.convertToBinaryCode("M;ASAS");
    } catch (err) {
      strictEqual(err instanceof JumpCodeParsingError, true);
    }
  });

  it("should return COMP code parsing error", () => {
    try {
      code.convertToBinaryCode("SAS;JMP");
    } catch (err) {
      strictEqual(err instanceof CompCodeParsingError, true);
    }
  });

  it("should return DEST code parsing error", () => {
    try {
      code.convertToBinaryCode("ASAS=M");
    } catch (err) {
      strictEqual(err instanceof DestCodeParsingError, true);
    }
  });
});
