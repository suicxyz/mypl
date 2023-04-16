import * as AST from "./ast.ts";
import * as L from "./lexer.ts";

export default class Parser {
	private tokens: L.Token[] = [];

	private notEOF (): boolean {
		return this.tokens[0].type != L.TokenType.EOF;
	}

	private at () {
		return this.tokens[0] as L.Token;
	}

	private eat () {
		var prev = this.tokens.shift() as L.Token;
		return prev;
	}

	private expect (type: L.TokenType, err: string) {
		var prev = this.tokens.shift() as L.token;
		if (!prev || prev.type != type) {
			console.error("Parser Error:\n", err, prev, " - Expecting:", type);
			Deno.exit();
		}

		return prev;
	}

	public ProduceAST (sourceCode: string): AST.Program {
		this.tokens = L.Tokenize(sourceCode);

		const program: AST.Program = {
			kind: "Program",
			body: []
		};

		// Parse until the end of file
		while (this.notEOF()) {
			program.body.push(this.parseStmt());
		}		

		return program;
	}

	private parseStmt (): AST.Stmt {
		return this.parseExpr();
	}

	private parseExpr (): AST.Expr {
		return this.parseAdditiveExpr();
	}

	private parseAdditiveExpr (): AST.Expr {
		var left = this.parsePrimaryExpr();

		while (this.at().value == "+" || this.at().value == "-") {
			var operator = this.eat().value;
			var right = this.parseMultiplicativeExpression();
			left = {
				kind: "BinaryExpr",
				left,
				right,
				operator
			} as AST.BinaryExpr;
		}
		
		return left;
	}

	private parseMultiplicativeExpression (): AST.Expr {
		var left = this.parsePrimaryExpr();

		while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
			var operator = this.eat().value;
			var right = this.parsePrimaryExpr();
			left = {
				kind: "BinaryExpr",
				left,
				right,
				operator
			} as AST.BinaryExpr;
		}
		
		return left;
	}

	private parsePrimaryExpr (): AST.Expr {
		const tk = this.at().type;

		switch (tk) {
			case L.TokenType.Identifier:
				return { kind: "Identifer", symbol: this.eat().value } as AST.Identifier;

			case L.TokenType.Null:
				this.eat();
				return { kind: "NullLiteral", value: "null" } as AST.NullLiteral;

			case L.TokenType.Number:
				return {
					kind: "NumericLiteral",
					value: parseFloat(this.eat().value)
				} as AST.NumericLiteral;

			case L.TokenType.OpenParen:
				this.eat();
				var value = this.parseExpr();
				this.expect(
					L.TokenType.CloseParen,
					"Unexpected token found inside parenthised expression. Expected closing parenthesis.");
				return value;

			default:
				console.log("Unexpected token found during parsing!", this.at());
				Deno.exit(1);
		} 
	}
}
