"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

require("abortcontroller-polyfill/dist/abortcontroller-polyfill-only");

var AbortError = /*#__PURE__*/function (_Error) {
  _inherits(AbortError, _Error);

  var _super = _createSuper(AbortError);

  function AbortError() {
    var _this;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Aborted";

    _classCallCheck(this, AbortError);

    _this = _super.call(this, message);
    _this.name = "AbortError";
    return _this;
  }

  return AbortError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * * This class extends Promise and add some extra abilities to it
 * * 1. Add AbortSignal to it and pass to Fetch as well, All the Promises are abortable/cancellable
 * * 2. Add some data to promise and fetch via .data
 * * 3. Get status of Promise using the getter isFulfilled, isSettled, isRejected, status
 * * 4. More features like resolve/reject from outside, timeout for fetch
 */


var AdvancedPromise = /*#__PURE__*/function (_Promise) {
  _inherits(AdvancedPromise, _Promise);

  var _super2 = _createSuper(AdvancedPromise);

  function AdvancedPromise(executor, timeout) {
    var _this2;

    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, AdvancedPromise);

    var abortController = new AbortController();
    var abortSignal = abortController.signal;
    var meta = {
      status: "pending",
      data: data,
      resolve: function resolve() {},
      reject: function reject() {},
      timeoutId: 0,
      timeoutStatus: undefined
    };

    var normalExecutor = function normalExecutor(resolve, reject) {
      var res = function res(d) {
        if (meta.status === "pending") {
          meta.status = "settled";
          if (resolve) resolve(d);
        }
      };

      var rej = function rej(d) {
        if (meta.status === "pending") {
          meta.status = "rejected";
          if (reject) reject(d);
        }
      };

      abortSignal.addEventListener("abort", function () {
        rej(new AbortError(_this2._abortReason));
      });
      meta.resolve = res;
      meta.reject = rej;
      executor(res, rej, abortSignal);
    };

    _this2 = _super2.call(this, normalExecutor);
    _this2._meta = meta; // Bind the abort method

    _this2.cancel = _this2.abort = function (reason) {
      _this2._abortReason = reason ? reason : "Aborted";
      abortController.abort();
    };

    if (timeout) {
      _this2._meta.timeoutStatus = false;
      _this2._meta.timeoutId = setTimeout(function () {
        _this2._meta.timeoutStatus = true;

        _this2.abort("".concat(timeout, "ms timeout expired"));
      }, timeout);
    }

    return _this2;
  }

  _createClass(AdvancedPromise, [{
    key: "cancelTimeout",
    value: function cancelTimeout() {
      if (!this.isFulfilled && this._meta.timeoutId) {
        clearTimeout(this._meta.timeoutId);
        return true;
      }

      return false;
    }
  }, {
    key: "resolve",
    value: function resolve(data) {
      this._meta.resolve(data);
    }
  }, {
    key: "reject",
    value: function reject(reason) {
      this._meta.reject(reason);
    } // Getter to access abort reason

  }, {
    key: "abortReason",
    get: function get() {
      return this._abortReason;
    }
  }, {
    key: "data",
    get: function get() {
      return this._meta.data;
    }
  }, {
    key: "isFulfilled",
    get: function get() {
      return this._meta.status !== "pending";
    }
  }, {
    key: "isSettled",
    get: function get() {
      return this._meta.status !== "settled";
    }
  }, {
    key: "isRejected",
    get: function get() {
      return this._meta.status !== "rejected";
    }
  }, {
    key: "isTimedout",
    get: function get() {
      return this._meta.timeoutStatus;
    }
  }, {
    key: "status",
    get: function get() {
      return this._meta.status;
    }
  }]);

  return AdvancedPromise;
}( /*#__PURE__*/_wrapNativeSuper(Promise));

_defineProperty(AdvancedPromise, "from", function (promise) {
  if (promise instanceof AdvancedPromise) {
    return promise;
  }

  return new AdvancedPromise(function (resolve, reject) {
    promise.then(resolve)["catch"](reject);
  });
});

module.exports = AdvancedPromise;