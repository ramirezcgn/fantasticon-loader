const { getOptions } = require('loader-utils');
const { generateFonts } = require('@ramirezcgn/fantasticon');
const NativeModule = require('module');

function wpGetOptions(context) {
  if (typeof context.query === 'string') {
    return getOptions(context);
  }
  return context.query;
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

  const { preview = false, ...options } = wOptions;
  const { onComplete = null, ...rawOptions } = rawFontConfig;
  var fontConfig = Object.assign({}, options, rawOptions);

  console.log('> Compiling Fonts!');
  generateFonts(fontConfig)
    .then(() => {
      if (preview && onComplete) {
        onComplete();
      }
      console.log('> Fonts Compiled!');
      callback(null, '');
    })
    .catch((err) => callback(err));
};
