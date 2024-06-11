import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import Parser from "../src/parser.js";
import Code from "../src/code.js";
import SymbolTable from "../src/symbolTable.js";
import { CodeParsingError } from "../src/errors.js";

describe("Parser", () => {
  describe("Code parsing", () => {
    const code = new Code();
    const symbolTable = new SymbolTable();

    const parser = new Parser({
      codeMatcher: code,
      symbolTable,
    });
    const comment = "// Comment";
    const whiteSpace = "\n \n \n \r \r";
    const instructions = [
      "@12  ",
      "   @R1",
      "  AMD=D-1  ",
      " 0;JMP",
      "@R1",
      "@i",
      "@i",
    ];
    const binaryCodes = [
      "0000000000001100",
      "0000000000000001",
      "1110001110111000",
      "1110101010000111",
      "0000000000000001",
      "0000000000010000",
      "0000000000010000",
    ];
    it("should return parsed binary code", () => {
      instructions.forEach((instruction, index) => {
        const parsedCode = parser.parse(instruction);
        strictEqual(parsedCode, `${binaryCodes[index]}\n`);
      });
    });
  });

  describe("First circle parsing", () => {
    const code = new Code();
    const symbolTable = new SymbolTable();

    const parser = new Parser({
      codeMatcher: code,
      symbolTable,
    });
    const codes = ["  ", "@ASAS  ", "(loop)", "@asd", "(end)", "@loop"];

    it("should match point for jump code and add it to the Symbol table", () => {
      const searchRomCode = parser.createFirstCircleParsing();

      codes.forEach((code, i) => {
        const symbol = searchRomCode(code);
        const foundSymbolVal = symbolTable.getSymbol(symbol);
        if (i == 2) {
          strictEqual(foundSymbolVal, 1);
          return;
        }
        if (i == 4) {
          strictEqual(foundSymbolVal, 2);
          return;
        } else {
          strictEqual(foundSymbolVal, undefined);
        }
      });
    });

    it("should return correct parsed code", () => {
      codes.forEach((code, i) => {
        const parsedCode = parser.parse(code);
        if (i == 1) {
          strictEqual(parsedCode, "0000000000010000\n");
          return;
        }
        if (i == 3) {
          strictEqual(parsedCode, "0000000000010001\n");
          return;
        }
        if (i == 5) {
          strictEqual(parsedCode, "0000000000000001\n");
          return;
        } else {
          strictEqual(parsedCode, null);
        }
      });
    });

    it("should return parser error", () => {
      try {
        const searchRomCode = parser.createFirstCircleParsing();
        searchRomCode("asdad");
      } catch (err) {
        strictEqual(err instanceof CodeParsingError, true);
      }
    });
  });
});
