; indents.scm — indentation rules for DQL.
;
; The lean tokenizing grammar doesn't expose CHECK/EXCEL/FN block structure,
; so editors fall back to brace-/paren-based auto-indent. Zed handles this
; via the `brackets` config in languages/<lang>/config.toml.
