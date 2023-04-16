import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";

repl();

function repl() {
  const parser = new Parser();
  console.log("\nRepl v0.1");

  while (true) {
    var input = prompt("> ");

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    var program = parser.ProduceAST(input);
    var result = evaluate(program);
    
    console.log(result)
  }
}
