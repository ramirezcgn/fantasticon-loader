const { getOptions } = require('loader-utils');
const { generateFonts } = require('fantasticon');
const NativeModule = require('module');
const serveStatic = require('serve-static');
const connect = require('connect');
const open = require('open');
const path = require('path');
const fs = require('fs');

function wpGetOptions(context) {
  if (typeof context.query === 'string') {
    return getOptions(context);
  }
  return context.query;
}

function server(dir, name) {
  const url = `http://localhost:8080/`;
  connect()
    .use(serveStatic(dir))
    .listen(8080, () => {
      console.log(`Server running on ${url} ...`);
      open(url + name);
    });
}

module.exports = function (content) {
  this.cacheable();
  const callback = this.async();
  const wOptions = wpGetOptions(this) || {};
  let rawFontConfig;
  let htmlPath = '';
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

  var fontConfig = Object.assign({}, options, rawFontConfig);
  if (fontConfig.pathOptions) {
    Object.values(fontConfig.pathOptions).forEach((entry) => {
      const dir = path.dirname(entry);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    if (fontConfig.pathOptions.html) {
      htmlPath = path.resolve(this.context, fontConfig.pathOptions.html);
    }
  }

  console.log('> Compiling Fonts!');
  generateFonts(fontConfig)
    .then(() => {
      if (preview && htmlPath) {
        const dir = path.dirname(htmlPath);
        const relative = path.relative(dir, fontConfig.outputDir);
        if (relative && relative.startsWith('..')) {
          const regex = new RegExp(fontConfig.name + '\\..*');
          fs.readdirSync(fontConfig.outputDir).forEach((file) => {
            if (regex.test(file)) {
              fs.copyFileSync(
                `${fontConfig.outputDir}/${file}`,
                `${dir}/${file}`
              );
            }
          });
        }
        server(dir, path.basename(htmlPath));
      }
      console.log('> Fonts Compiled!');
      callback(null, '');
    })
    .catch((err) => callback(err));
};
