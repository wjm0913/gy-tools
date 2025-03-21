// eslint-disable-next-line no-new-func
const dynamicImport = new Function('specifier', 'return import(specifier)')

exports.dynamicImport = dynamicImport
