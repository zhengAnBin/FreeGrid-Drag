const Utils = {
  // 类型判断
  class2type: (function () {
    "Boolean Number String Function Array Date RegExp Object Error Null Undefined".split(" ").map(function (item) {
      Utils.class2type["[object " + item + "]"] = item.toLowerCase();
    })
  })(),
  type: function (obj) {
    if (obj == null) {
      return obj + "";
    }

    return typeof obj === "object" || typeof obj === "function" ? constant.class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj;
  },

  isObject: function isObject(o) {
    return typeof o === "object" && o !== null && o.constructor && o.constructor === Object;
  },

  extend: function extend() {
    var args = [],
      len$1 = arguments.length;

    while (len$1--) args[len$1] = arguments[len$1];

    var to = Object(args[0]);

    for (var i = 1; i < args.length; i += 1) {
      var nextSource = args[i];

      if (nextSource !== undefined && nextSource !== null) {
        var keysArray = Object.keys(Object(nextSource));

        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

          if (desc !== undefined && desc.enumerable) {
            if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
              Utils.extend(to[nextKey], nextSource[nextKey]);
            } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
              to[nextKey] = {};
              Utils.extend(to[nextKey], nextSource[nextKey]);
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  },

  throttle: function (func, wait) {
    var timeout, context, args;
    var previous = 0;

    var later = function () {
      previous = +new Date();
      timeout = null;
      func.apply(context, args);
    };

    var throttled = function () {
      var now = +new Date(); 

      var remaining = wait - (now - previous);
      context = this;
      args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous = now;
        func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
    };

    return throttled;
  }
}; 

export default Utils;