# fantasticon-loader

[![npm](https://img.shields.io/npm/v/fantasticon-loader.svg)](https://www.npmjs.com/package/fantasticon-loader)
[![npm](https://img.shields.io/npm/dm/fantasticon-loader.svg)](https://www.npmjs.com/package/fantasticon-loader)
[![license](https://img.shields.io/github/license/ramirezcgn/fantasticon-loader.svg)](https://github.com/ramirezcgn/fantasticon-loader/blob/master/LICENSE)

A Webpack loader that generates fonts from your SVG icons and allows you to use your icons in your HTML.

`fantasticon-loader` uses the [`fantasticon`](https://github.com/ramirezcgn/fantasticon) plugin to create fonts in any format. It also generates CSS files so that you can use your icons directly in your HTML, using CSS classes.

## Installation

```
npm install fantasticon-loader --save-dev
```

## Usage

### Webpack rule

Add this rule to your Webpack config:

```javascript
{
  test: /\.fantasticonrc\.js/,
  use: [
    {
      loader: 'fantasticon-loader',
      options: {
        preview: false
      }
    },
  ]
}
```

preview: Launch a static server for the generated html file if was add as option.

Then you have to require the configuration file:

```javascript
// entry.js
require('.fantasticonrc.js');
```

### Configuration file

Here's an example `.fantasticonrc.js`:

```js
module.exports = {
  inputDir: './icons', // (required)
  outputDir: './dist', // (required)
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['ts', 'css', 'json', 'html'],
  fontsUrl: '/static/fonts',
  formatOptions: {
    // Pass options directly to `svgicons2svgfont`
    woff: {
      // Woff Extended Metadata Block - see https://www.w3.org/TR/WOFF/#Metadata
      metadata: '...'
    },
    json: {
      // render the JSON human readable with two spaces indentation (default is none, so minified)
      indent: 2
    },
    ts: {
      // select what kind of types you want to generate (default `['enum', 'constant', 'literalId', 'literalKey']`)
      types: ['constant', 'literalId'],
      // render the types with `'` instead of `"` (default is `"`)
      singleQuotes: true
    }
  },
  // Use a custom Handlebars template
  templates: {
    css: './my-custom-tp.css.hbs'
  },
  pathOptions: {
    ts: './src/types/icon-types.ts',
    json: './misc/icon-codepoints.json'
  },
  codepoints: {
    'chevron-left': 57344, // decimal representation of 0xe000
    'chevron-right': 57345,
    'thumbs-up': 57358,
    'thumbs-down': 57359
  },
  // Customize generated icon IDs (unavailable with `.json` config file)
  getIconId: ({
    basename, // `string` - Example: 'foo';
    relativeDirPath, // `string` - Example: 'sub/dir/foo.svg'
    absoluteFilePath, // `string` - Example: '/var/icons/sub/dir/foo.svg'
    relativeFilePath, // `string` - Example: 'foo.svg'
    index // `number` - Example: `0`
  }) => [index, basename].join('_') // '0_foo'
};
```

The loader will then generate:

* CSS with the base and class prefix
* Font files for the SVG icons

#### Configuration options

See [fantasticon#configuration-file](https://github.com/ramirezcgn/fantasticon#configuration-file)
