import {
  NUMBER_CODE_REGEX,
  VALID_CODE,
  VAR_CODE_REGEXP,
} from "./constants/codeRegexps.js";
import { CodeParsingError } from "./errors.js";

export default class Parser {
  #symbolTable;
  #codeMatcher;

  #validateAndClearAssemblyCode(code) {
    const cleanCode = code.replace(/((\/\/.*)|(\s*))/gm, "");
    if (
      cleanCode.search(VALID_CODE) > -1 ||
      cleanCode.search(/^(\([a-zA-Z]).*\)$/) > -1 ||
      cleanCode == ""
    ) {
      return cleanCode;
    } else {
      throw new CodeParsingError(code);
    }
  }

  #checkSymbolTable(pureSymbol) {
    if (!this.#symbolTable.hasSymbol(pureSymbol)) {
      this.#symbolTable.setRamSymbol(pureSymbol);
    }

    return this.#symbolTable.getSymbol(pureSymbol);
  }

  constructor({ codeMatcher, symbolTable }) {
    this.#codeMatcher = codeMatcher;
    this.#symbolTable = symbolTable;
  }

  createFirstCircleParsing() {
    let currentCodeNumber = 0;

    return (code) => {
      const parsedCode = this.#validateAndClearAssemblyCode(code);
      if (!parsedCode) {
        return null;
      }
      let romCode = null;
      if (parsedCode.search(/^(\([a-zA-Z0-9]).*\)$/) > -1) {
        romCode = parsedCode.slice(1, parsedCode.length - 1);

        this.#symbolTable.setRomSymbol(romCode, currentCodeNumber);
      } else {
        currentCodeNumber += 1;
      }
      return romCode;
    };
  }

  parse(instruction) {
    const parsedCode = this.#validateAndClearAssemblyCode(instruction);
    if (!parsedCode || parsedCode.search(/^(\([a-zA-Z]).*\)$/) > -1) {
      return null;
    }
    let returnedCode = parsedCode;

    if (parsedCode.search(VAR_CODE_REGEXP) > -1) {
      const pureCode = parsedCode.slice(1);
      returnedCode = this.#checkSymbolTable(pureCode);
    }

    if (parsedCode.search(NUMBER_CODE_REGEX) > -1) {
      const pureCode = parsedCode.slice(1);
      returnedCode = pureCode;
    }

    return this.#codeMatcher.convertToBinaryCode(returnedCode);
  }
}
