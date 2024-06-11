import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { createWriteStream, createReadStream } from "node:fs";
import { homedir } from "node:os";
import { join, extname } from "node:path";
import Parser from "./parser.js";
import Code from "./code.js";
import SymbolTable from "./symbolTable.js";
import { ExtensionError, ReadFileError, WriteFileError } from "./errors.js";

class Main {
  #rl = createInterface(stdin, stdout);
  #parser;
  #homeDir = homedir();

  #showInstructionMess() {
    console.log(
      `You are at home directory "${
        this.#homeDir
      }". Enter the relative path to the file with '.asm' extension`
    );
  }

  #changeFileExtension(filePath) {
    const spitedArr = filePath.split(".");
    spitedArr[spitedArr.length - 1] = "hack";
    return spitedArr.join(".");
  }

  #createWriteStream(filePath) {
    const newFilePath = this.#changeFileExtension(filePath);
    return createWriteStream(newFilePath).on("error", () => {
      console.log(new WriteFileError(filePath));
    });
  }

  #createReadLineByLineInterface(filePath) {
    const readStream = createReadStream(filePath);
    readStream.on("error", (e) => {
      console.log(new ReadFileError(filePath));
    });
    return createInterface({
      input: readStream,
      crlfDelay: Infinity,
    }).on("error", (e) => {
      return;
    });
  }

  #readFile(filePath) {
    if (extname(filePath) !== ".asm") {
      throw new ExtensionError();
    }
    const firstCircleReading = this.#createReadLineByLineInterface(filePath);
    const firstCircleParsingFun = this.#parser.createFirstCircleParsing();

    firstCircleReading.on("line", (fileLine) => {
      try {
        firstCircleParsingFun(fileLine);
      } catch (e) {
        console.log(e.message);
      }
    });

    firstCircleReading.on("close", () => {
      const writeStream = this.#createWriteStream(filePath);
      const secondCircleReading = this.#createReadLineByLineInterface(filePath);
      secondCircleReading.on("line", (fileLine) => {
        try {
          const parsedCode = this.#parser.parse(fileLine);
          if (parsedCode) {
            writeStream.write(parsedCode);
          }
        } catch (e) {
          console.log(e);
        }
      });
      secondCircleReading.on("close", () => {
        writeStream.close();
        this.#showInstructionMess();
      });
    });
  }

  constructor(codeMatcher, symbolTable) {
    this.#parser = new Parser({ codeMatcher, symbolTable });
  }

  init() {
    this.#showInstructionMess();
    this.#rl.on("line", (path) => {
      try {
        const trimmedPath = path.trim();
        if (trimmedPath) {
          const filePath = join(this.#homeDir, trimmedPath);
          this.#readFile(filePath);
        }
      } catch (e) {
        console.log(e.message);
      }
    });
  }
}

new Main(new Code(), new SymbolTable()).init();
