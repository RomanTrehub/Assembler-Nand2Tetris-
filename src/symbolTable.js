export default class SymbolTable {
  #symbolTable = new Map([
    ["SP", 0],
    ["LCL", 1],
    ["ARG", 2],
    ["THIS", 3],
    ["THAT", 4],
    ["SCREEN", 16384],
    ["KBD", 24576],
  ]);

  #nextAvailableRamVal = 16;

  constructor() {
    // setting R symbols
    for (let i = 0; i < 16; i++) {
      this.#symbolTable.set(`R${i}`, i);
    }
  }

  hasSymbol(symbol) {
    return this.#symbolTable.has(symbol);
  }

  getSymbol(symbol) {
    return this.#symbolTable.get(symbol);
  }

  setRamSymbol(symbol) {
    this.#symbolTable.set(symbol, this.#nextAvailableRamVal);
    this.#nextAvailableRamVal += 1;
  }

  setRomSymbol(symbol, symbolValue) {
    this.#symbolTable.set(symbol, symbolValue);
  }
}
