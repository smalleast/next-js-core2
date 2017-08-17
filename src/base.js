nx = {
  BREAKER: {},
  VERSION: '1.3.0',
  DEBUG: false,
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var DOT = '.';
  var NUMBER = 'number';

  nx.noop = function () {
  };

  nx.error = function (inMsg) {
    throw new Error(inMsg);
  };

  nx.each = function (inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function (inKey, inValue) {
      return inCallback.call(inContext, inKey, inValue) === nx.BREAKER;
    };

    if (inTarget) {
      if (inTarget.each) {
        return inTarget.each(inCallback, inContext);
      } else {
        length = inTarget.length;
        if (typeof length === NUMBER) {
          for (key = 0; key < length; key++) {
            if (iterator(key, inTarget[key])) {
              break;
            }
          }
        } else {
          for (key in inTarget) {
            if (inTarget.hasOwnProperty(key)) {
              if (iterator(key, inTarget[key])) {
                break;
              }
            }
          }
        }
      }
    }
  };

  nx.mix = function (inTarget) {
    var target = inTarget || {};
    var i, length;
    var args = arguments;
    for (i = 1, length = args.length; i < length; i++) {
      nx.each(args[i], function (key, val) {
        target[key] = val;
      });
    }
    return target;
  };

  nx.get = function (inTarget, inName) {
    if (inTarget) {
      if (inTarget.get) {
        return inTarget.get(inName);
      } else {
        return inTarget[inName];
      }
    }
  };

  nx.set = function (inTarget, inName, inValue) {
    if (inTarget) {
      if (inTarget.set && inTarget !== nx) {
        return inTarget.set(inName, inValue);
      } else {
        return inTarget[inName] = inValue;
      }
    }
  };

  nx.path = function (inTarget, inPath, inValue) {
    var paths = inPath.split(DOT);
    var result = inTarget || nx.global;
    var last;

    if (undefined === inValue) {
      nx.each(paths, function (_, path) {
        result = nx.get(result, path);
      });
    } else {
      last = paths.pop();
      paths.forEach(function (path) {
        result = result[path] = result[path] || {};
      });
      nx.set(result, last, inValue);
    }
    return result;
  };

  nx.hashlize = function (inUrl) {
    var result = {};
    var query = inUrl == null ? global.location.search.substring(1) : inUrl.substring(inUrl.indexOf('?') + 1);
    var params = query.split('&');
    var arr, pair, key, value;
    nx.each(params, function (_, param) {
      pair = param.split('=');
      key = pair[0];
      value = pair[1];
      if (value) {
        switch (typeof result[key]) {
          case 'undefined':
            result[key] = decodeURIComponent(value);
            break;
          case 'string':
            arr = [result[key], decodeURIComponent(value)];
            result[key] = arr;
            break;
          default:
            result[key].push(decodeURIComponent(value));
        }
      }
    });
    return result;
  };

  nx.delete = function (inObject, inArray) {
    var obj = nx.clone({}, inObject, true);
    inArray.forEach(function (key) {
      delete obj[key];
    });
    return obj;
  };

  nx.param = function(inObj) {
    var str = [];
    var key, value, encodeValue;
    for (key in inObj) {
      value = inObj[key];
      if (value != null) {
        encodeValue = nx.isArray(value) ? value.join() : value;
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(encodeValue));
      }
    }
    return str.join("&");
  };

}(nx, nx.GLOBAL));


if (typeof module !== 'undefined' && module.exports) {
  module.exports = nx;
}
