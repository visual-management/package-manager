const path = require('path');

class DynamicPathParser {

  static relative (...args) {
    return DynamicPathParser.slash(path.relative(...args));
  }

  static slash (str) {
    let isExtendedLengthPath = /^\\\\\?\\/.test(str);
    let hasNonAscii = /[^\x00-\x80]+/.test(str);

    if (isExtendedLengthPath || hasNonAscii) {
      return str;
    }

    return str.replace(/\\/g, '/');
  }

}

module.exports = DynamicPathParser;
