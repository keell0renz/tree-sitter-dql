; =============================================================================
; highlights.scm — syntax highlighting for the DQL language ecosystem.
;
; Targets the lean tokenizing grammar in grammar.js: every leaf in the parse
; tree is one of a small set of node kinds (keyword, format, id, string, ...).
; =============================================================================

; ---------------------------------------------------------------------------
; Comments
; ---------------------------------------------------------------------------
(line_comment) @comment

; ---------------------------------------------------------------------------
; Surface directive (DQL, DQL-EF, DQL-SF, DQL-SN)
; ---------------------------------------------------------------------------
(dql_surface_keyword) @keyword.import

; ---------------------------------------------------------------------------
; Reserved keywords. Distinguish a "control / status" subset that gets
; @keyword.operator or @keyword.conditional treatment in most themes.
; ---------------------------------------------------------------------------
(keyword) @keyword

; ---------------------------------------------------------------------------
; Format names — STRING / NUMBER / DATE / COUNTRY / WEIGHT / MONEY / COMPANY /
; TEXT / BOOLEAN. These annotate a value's domain type.
; ---------------------------------------------------------------------------
(format) @type

; ---------------------------------------------------------------------------
; List-column type keywords: `string`, `number`, `any`.
; ---------------------------------------------------------------------------
(type_keyword) @type.builtin

; ---------------------------------------------------------------------------
; Literals
; ---------------------------------------------------------------------------
(string) @string
(bare_date) @string.special
(number) @number
(percent) @number
(unit_number) @number
(boolean) @boolean
(null) @constant.builtin

; ---------------------------------------------------------------------------
; Stable operation IDs — r_xxx, c_xxx, check_xxx, a_xxx, t_xxx, p_xxx,
; f_xxx, op_*. Rendered as constants so they stand out.
; ---------------------------------------------------------------------------
(id) @constant

; ---------------------------------------------------------------------------
; Metadata fields in DQL-EF (_title, _description, _dql, …)
; ---------------------------------------------------------------------------
(metadata_key) @property

; ---------------------------------------------------------------------------
; Identifiers — variables, aliases, field names. Themes usually leave these
; without special color (which is the right call for a tokenizing grammar).
; ---------------------------------------------------------------------------
(identifier) @variable

; ---------------------------------------------------------------------------
; Punctuation — single-char tokens get classified by character.
; ---------------------------------------------------------------------------
((punctuation) @punctuation.bracket
  (#match? @punctuation.bracket "^[()\\[\\]{}]$"))

((punctuation) @punctuation.delimiter
  (#match? @punctuation.delimiter "^[,;:.]$"))

((punctuation) @punctuation.special
  (#match? @punctuation.special "^[|]$"))

((punctuation) @operator
  (#match? @operator "^[=<>!?+*/-]$"))
