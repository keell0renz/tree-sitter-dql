; folds.scm — code-folding ranges for DQL.
;
; The lean tokenizing grammar in grammar.js doesn't expose structural blocks
; (CHECK/FN/EXCEL) as nodes, so editor-level brace-based folding handles those.
; Zed falls back to bracket-based folding automatically when this file is empty.
