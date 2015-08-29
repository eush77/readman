[![npm](https://nodei.co/npm/readman.png)](https://npmjs.com/package/readman)

# readman

[![Dependency Status][david-badge]][david]

Display local package readme as a man page.

Like [readme], but renders readme into a full-fledged man page.

[readme]: https://github.com/dominictarr/readme

[david]: https://david-dm.org/eush77/readman
[david-badge]: https://david-dm.org/eush77/readman.png

## CLI

#### `$ readman [--global | -g] [<module>]`

Displays man page for `<module>` (requiring it through the usual Node `require.resolve` algorithm) or for module at the current directory (stepping up into parent directories if needed).

With `-g` flag, module name is resolved globally instead of locally.

## Related

`readman` is basically a hybrid of these two packages:

- [readme]: display local package readme in Markdown.
- [npm-man]: display any package readme from npm registry (over the network).

[npm-man]: https://github.com/eush77/npm-man

## Install

```
npm install -g readman
```

## License

MIT
