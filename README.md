# tree-sitter-dql

Tree-sitter grammar for the [DQL](https://github.com/keell0renz/customs-os) language ecosystem — Customs OS's deterministic data-query / validation / extraction DSL. Drives syntax highlighting in [zed-dql](https://github.com/keell0renz/zed-dql) and any other tree-sitter-aware editor (Helix, Neovim with nvim-treesitter, etc.).

## Coverage

A single grammar tokenizes all four DQL surfaces:

- `.dql`   — executable language
- `.dqlef` — extraction format
- `.dqlsf` — schema/profile format
- `.dqlsn` — snapshot text rendering

## Design

This grammar is intentionally **lean** — it tokenizes rather than fully parses. That's all syntax highlighting needs. Real semantic analysis lives in the LSP server (in `customs-os`). Keeping the grammar at the token level avoids the cascade of ambiguities that a full parser fights with.

Tokens captured:

- `dql_surface_keyword` — `DQL`, `DQL-EF`, `DQL-SF`, `DQL-SN`
- `keyword` — `ALIAS`, `CHECK`, `ASSERT`, `END`, `FROM`, `JOIN`, … (uppercase)
- `format` — `STRING`, `NUMBER`, `DATE`, `COUNTRY`, `WEIGHT`, `MONEY`, `COMPANY`, `TEXT`, `BOOLEAN`
- `type_keyword` — `string`, `number`, `any` (lowercase, list-column signatures)
- `id` — stable IDs: `r_`, `c_`, `check_`, `a_`, `t_`, `p_`, `f_`, `op_*_`
- `metadata_key` — `_title`, `_description`, `_dql`, …
- `string`, `number`, `percent`, `unit_number`, `bare_date`, `boolean`, `null`
- `identifier`, `punctuation`, `line_comment`

## Build

The committed `src/parser.c` is generated; consumers don't need to run anything. To regenerate after editing `grammar.js`:

```
npm install
npx tree-sitter generate
```

## Test

```
echo 'DQL 1; ALIAS x AS x; PRINT x.foo;' | npx tree-sitter parse /dev/stdin
```

## License

MIT.
