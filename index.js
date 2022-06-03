const { generateFonts } = require('@ramirezcgn/fantasticon');
const NativeModule = require('module');
const JSON5 = require('json5');

const specialValues = {
  null: null,
  true: true,
  false: false,
};

function parseQuery(query) {
  if (query.substr(0, 1) !== '?') {
    throw new Error(
      "A valid query string passed to parseQuery should begin with '?'"
    );
  }

  query = query.substr(1);

  if (!query) {
    return {};
  }

  if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
    return JSON5.parse(query);
  }

  const queryArgs = query.split(/[,&]/g);
  const result = {};

  queryArgs.forEach((arg) => {
    const idx = arg.indexOf('=');

    if (idx >= 0) {
      let name = arg.substr(0, idx);
      let value = decodeURIComponent(arg.substr(idx + 1));

      // eslint-disable-next-line no-prototype-builtins
      if (specialValues.hasOwnProperty(value)) {
        value = specialValues[value];
      }

      if (name.substr(-2) === '[]') {
        name = decodeURIComponent(name.substr(0, name.length - 2));

        if (!Array.isArray(result[name])) {
          result[name] = [];
        }

        result[name].push(value);
      } else {
        name = decodeURIComponent(name);
        result[name] = value;
      }
    } else {
      if (arg.substr(0, 1) === '-') {
        result[decodeURIComponent(arg.substr(1))] = false;
      } else if (arg.substr(0, 1) === '+') {
        result[decodeURIComponent(arg.substr(1))] = true;
      } else {
        result[decodeURIComponent(arg)] = true;
      }
    }
  });

  return result;
}

function wpGetOptions(context) {
  const query = context.query;

  if (typeof query === 'string' && query !== '') {
    return parseQuery(context.query);
  }

  if (!query || typeof query !== 'object') {
    // Not object-like queries are not supported.
    return {};
  }

  return query;
}

module.exports = function (content) {
  this.cacheable();
  const callback = this.async();
  const wOptions = wpGetOptions(this) || {};
  let rawFontConfig;
  try {
    rawFontConfig = JSON.parse(content);
  } catch (ex) {
    const module = new NativeModule(this.resourcePath);
    module.paths = NativeModule._nodeModulePaths(this.context);
    module.filename = this.resourcePath;
    module._compile(content, this.resourcePath);
    rawFontConfig = module.exports;
  }

  const { runOnComplete = false, ...options } = wOptions;
  const { onComplete = null, ...rawOptions } = rawFontConfig;
  var fontConfig = Object.assign({}, options, rawOptions);

  console.log('> Compiling Fonts!');
  generateFonts(fontConfig)
    .then(() => {
      if (runOnComplete && onComplete) {
        onComplete(fontConfig);
      }
      console.log('> Fonts Compiled!');
      callback(null, '');
    })
    .catch((err) => callback(err));
};
