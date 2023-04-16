import { NullVal, NumberVal, ValueType, RuntimeVal } from "./values.ts";
import { NodeType, NumericLiteral, BinaryExpr, Stmt } from "../frontend/ast.ts";

function evaluateBinaryExpr (binop: BinaryExpr): Runtimeval {
	
}

export function evaluate (astNode: Stmt): RuntimeVal {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: ((astNode as NumericLiterral).value),
				type: "number"
			} as NumberVal;
		
		case "NullLiteral":
			return { value: "null", type: "null" } as NullVal;

		default:
			console.log("This AST Node has not yet been setup for interpretation.", astNode);
			Deno.exit(0);
	}
}