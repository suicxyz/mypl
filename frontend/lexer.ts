// -----------------------------------------------------------
// ----------------           LEXER           ----------------
// ---  Responsible for producing tokens from the source   ---
// -----------------------------------------------------------

export enum TokenType {
	// Literal types
	Null,
	Number,
	Identifier,

	// Keywords
	Let,

	// Grouping * Operators
	BinaryOperator,
	Equals,
	OpenParen,
	CloseParen,

	EOF, // End Of File
}

/**
 * Constant lookup for keywords and known identifiers + symbols
 * */
const KEYWORDS: Record<string, TokenType> = {
	"let": TokenType.Let,
	"null": TokenType.Null
}
// Represents a single token from the source code
export interface Token {
	value: string; // THr row value as seen inside the source code
	type: TokenType; // Tagged strucuture
}

/**
 * Returns a token of a given type and value
 * */
function token(value = "", type: TokenType): Token {
	return { value, type };
}

/**
 * Returns true if the character is alphabetic like -> [a-zA-Z]
 * */
function isAlpha(str: string) {
	return str.toUpperCase() != str.toLocaleLowerCase();
}

/**
 * Returns true if the character is a valid integer -> [0-9]
 * */
function isInt(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 * */
function isSkippable(str: string) {
	return str == " " || str ==  "\n" || str == "\t";
}

/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidientifed charaters.
 * 
 * - Returns an array of tokens
 * - Does not modify the incoming script
 * */
export function Tokenize(sourceCode: string): Array<Token> {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	// Produce tokens until EOF is reached
	while (src.length > 0) {
		// BEGIN PARSIN ONE CHARACTER TOKENS
		if (src[0] == "(") {
				tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
				tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
				tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} else if (src[0] == "=") {
				tokens.push(token(src.shift(), TokenType.Equals));
		} else {
			if (isInt(src[0])) {
				let num = "";

				while (src.length > 0 && isInt(src[0])) {
					num += src.shift();
				}
				
				tokens.push(token(num, TokenType.Number));
			} else if (isAlpha(src[0])) {
				let ident = "";

				while (src.length > 0 && isAlpha(src[0])) {
					ident += src.shift();
				}
				
				const reserved = KEYWORDS[ident];
				if (typeof reserved == "number") {
					tokens.push(token(ident, reserved));
				} else {
					tokens.push(token(ident, TokenType.Identifier));
				}
			} else if (isSkippable(src[0])) {
				src.shift();
			} else {
				console.error(
          "Unreconized character found in source: ",
          src[0].charCodeAt(0),
          src[0],
        );
				Deno.exit(1);
			}
		}
	}

	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}

