/**
 * tree-sitter-dql — token grammar for the DQL language ecosystem.
 *
 * Covers all four surfaces with a single grammar:
 *   DQL       (.dql)   — executable language
 *   DQL-EF    (.dqlef) — extraction format
 *   DQL-SF    (.dqlsf) — schema/profile format
 *   DQL-SN    (.dqlsn) — snapshot text rendering
 *
 * Design: this grammar is intentionally LEAN — it tokenizes rather than
 * fully parses. That's all syntax highlighting needs. Real semantic analysis
 * is done by the LSP server (src/dql/lsp/* in the customs-os repo). Keeping
 * the grammar at the token level avoids the cascade of ambiguities that
 * production parsers fight with, and means `tree-sitter generate` is happy.
 */

module.exports = grammar({
  name: "dql",

  // Whitespace is ignored at the token level (no significant indentation here —
  // that's the LSP's problem).
  extras: ($) => [/\s+/, $.line_comment],

  // Used so `word` keywords (like `ALIAS`) bind tighter than the general
  // `identifier` rule below.
  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._token),

    _token: ($) =>
      choice(
        $.string,
        $.id,
        $.unit_number,
        $.percent,
        $.bare_date,
        $.number,
        $.format,
        $.dql_surface_keyword,
        $.keyword,
        $.type_keyword,
        $.boolean,
        $.null,
        $.metadata_key,
        $.identifier,
        $.punctuation,
      ),

    // -----------------------------------------------------------------------
    // Comments — `//` to end of line. (No multi-line, no `--` per language spec.)
    // -----------------------------------------------------------------------
    line_comment: ($) => token(seq("//", /[^\n]*/)),

    // -----------------------------------------------------------------------
    // Strings — single-line double-quoted with escapes. Triple-quoted strings
    // (`"""..."""`, rare; DQL-EF only) fall through to multiple `string`
    // tokens, which still highlights correctly even if not perfectly grouped.
    // -----------------------------------------------------------------------
    string: ($) => token(seq('"', /(\\["\\nrt]|[^"\\\n])*/, '"')),

    // -----------------------------------------------------------------------
    // Stable IDs (spec §10.3). These come first so they don't get eaten by
    // `identifier`. Pattern: <prefix>_<hex/alnum>.
    // -----------------------------------------------------------------------
    id: ($) => token(prec(2, /(r_|check_|c_|a_|t_|p_|f_|op_[a-z]+_)[A-Za-z0-9_]+/)),

    // -----------------------------------------------------------------------
    // Numbers — int, float, percent (`0.5%`), unit (`1_kg`), bare date
    // (`2026-03-15`). Bare-date is tokenized first so it doesn't fragment.
    // -----------------------------------------------------------------------
    bare_date: ($) => token(prec(3, /\d{4}-\d{2}-\d{2}/)),
    unit_number: ($) => token(prec(2, /-?\d+(\.\d+)?_[a-zA-Z]+/)),
    percent: ($) => token(prec(2, /-?\d+(\.\d+)?%/)),
    number: ($) => token(/-?\d+(\.\d+)?/),

    // -----------------------------------------------------------------------
    // Format names — captured as `@type` in highlights.
    // -----------------------------------------------------------------------
    format: ($) => choice("STRING", "NUMBER", "TEXT", "BOOLEAN", "DATE", "COUNTRY", "WEIGHT", "MONEY", "COMPANY"),

    // -----------------------------------------------------------------------
    // Surface directives — DQL, DQL-EF, DQL-SF, DQL-SN.
    // -----------------------------------------------------------------------
    dql_surface_keyword: ($) => choice("DQL", "DQL-EF", "DQL-SF", "DQL-SN"),

    // -----------------------------------------------------------------------
    // Reserved keywords (uppercase). Spec §9.
    // -----------------------------------------------------------------------
    keyword: ($) =>
      choice(
        "ALIAS",
        "AS",
        "LET",
        "IMPORT",
        "DATA",
        "FN",
        "CALL",
        "PRINT",
        "CHECK",
        "ASSERT",
        "END",
        "TRIAGE",
        "EXPORT",
        "EXCEL",
        "CELL",
        "TABLE",
        "FROM",
        "WHERE",
        "SELECT",
        "JOIN",
        "ON",
        "INNER",
        "LEFT",
        "FULL",
        "OUTER",
        "ORDER",
        "BY",
        "ASC",
        "DESC",
        "SKIP",
        "LIMIT",
        "TOLERANCE",
        "APART",
        "FUZZY",
        "NORMALIZE",
        "CURRENCY",
        "BETWEEN",
        "IN",
        "NOT",
        "IS",
        "NULL",
        "UNIQUE",
        "BEFORE",
        "AFTER",
        "WITHIN",
        "DAYS",
        "OF",
        "ANY",
        "ALL",
        "MATCHES",
        "MARK",
        "TRUE",
        "FALSE_POSITIVE",
        "UNSURE",
        "TITLE",
        "COMMENT",
        "REQUIRE",
        "LEN",
        "LENGTH",
        "SUM",
        "AVG",
        "MIN",
        "MAX",
        "COUNT",
        "COUNT_DISTINCT",
        // DQL-SN section headers
        "RUN",
        "SOURCE",
        "PASSED",
        "FAILED",
        "EMPTY",
        "DUPLICATE",
        "MISMATCH",
        "PRESENCE",
        "NOTES",
        // DQL-SF section header
        "DOCUMENT",
      ),

    // -----------------------------------------------------------------------
    // Type keywords for list-column signatures: `code: string`, `qty: number`,
    // `payload: any`. Lowercase to disambiguate from format keywords.
    // -----------------------------------------------------------------------
    type_keyword: ($) => choice("string", "number", "any"),

    // -----------------------------------------------------------------------
    // Literals — booleans and null. Lowercase per spec §6.1.
    // -----------------------------------------------------------------------
    boolean: ($) => choice("true", "false"),
    null: ($) => "null",

    // -----------------------------------------------------------------------
    // Metadata keys — DQL-EF style `_title:`, `_description:`, `_dql:`, etc.
    // Captured as `@property` in highlights.
    // -----------------------------------------------------------------------
    metadata_key: ($) => token(prec(2, /_[a-z][a-z_0-9]*/)),

    // -----------------------------------------------------------------------
    // Identifiers — anything alphanumeric not matched above.
    // -----------------------------------------------------------------------
    identifier: ($) => /[A-Za-z][A-Za-z0-9_]*/,

    // -----------------------------------------------------------------------
    // Punctuation — single-char tokens. Multi-char ops like `==`, `!=`, `>=`,
    // `<=`, `??` get matched as two separate tokens, which is fine for
    // highlighting purposes.
    // -----------------------------------------------------------------------
    punctuation: ($) => choice("(", ")", "[", "]", "{", "}", ",", ";", ":", ".", "|", "=", "<", ">", "!", "?", "+", "-", "*", "/"),
  },
});
