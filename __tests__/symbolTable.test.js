import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import SymbolTable from "../src/symbolTable.js";

describe("Symbol Table", () => {
  const symbolTable = new SymbolTable();

  it("should return pre-defined symbol`s value", () => {
    // from R0 to R15
    for (let i = 0; i < 16; i++) {
      strictEqual(symbolTable.getSymbol(`R${i}`), i);
    }

    strictEqual(symbolTable.getSymbol("SP"), 0);
    strictEqual(symbolTable.getSymbol("LCL"), 1);
    strictEqual(symbolTable.getSymbol("ARG"), 2);
    strictEqual(symbolTable.getSymbol("THIS"), 3);
    strictEqual(symbolTable.getSymbol("THAT"), 4);
    strictEqual(symbolTable.getSymbol("SCREEN"), 16384);
    strictEqual(symbolTable.getSymbol("KBD"), 24576);
  });

  it("should set RAM`s symbols", () => {
    for (let i = 16; i <= 25; i++) {
      symbolTable.setRamSymbol(`newSymbolValue${i}`);
      const symbolValue = symbolTable.getSymbol(`newSymbolValue${i}`);
      strictEqual(symbolValue, i);
    }
  });

  it("should add new symbol value", () => {
    const newValue = 176;
    symbolTable.setRomSymbol("newSymbol", newValue);
    const newSymbolValue = symbolTable.getSymbol("newSymbol");
    strictEqual(newSymbolValue, newValue);
  });
});
