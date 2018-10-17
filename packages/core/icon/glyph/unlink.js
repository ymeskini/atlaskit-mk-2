"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _index = _interopRequireDefault(require("../es5/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var UnlinkIcon = function UnlinkIcon(props) {
  return _react.default.createElement(_index.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M13.721 14.43a.972.972 0 0 0-1.37-.004l-2.088 2.059a1.928 1.928 0 0 1-1.37.568c-.588 0-1.135-.26-1.525-.738-.634-.777-.505-1.933.203-2.643l1.321-1.322.002.001.688-.686a.974.974 0 0 0 0-1.377l-.002-.003a.972.972 0 0 0-1.375 0l-2.068 2.07a3.892 3.892 0 0 0 0 5.497l.009.01A3.87 3.87 0 0 0 8.892 19a3.87 3.87 0 0 0 2.746-1.139l2.083-2.085a.951.951 0 0 0 0-1.345zm-3.442-4.86a.972.972 0 0 0 1.37.004l2.088-2.058c.366-.367.853-.57 1.37-.57.588 0 1.135.26 1.525.739.634.777.505 1.933-.203 2.643l-1.321 1.322-.002-.001-.688.686a.974.974 0 0 0 0 1.377l.002.003c.38.38.995.38 1.375 0l2.068-2.07a3.892 3.892 0 0 0 0-5.497l-.009-.01A3.87 3.87 0 0 0 15.108 5a3.87 3.87 0 0 0-2.746 1.139l-2.083 2.085a.951.951 0 0 0 0 1.345zM8.924 4.618l.401.968a1 1 0 1 1-1.848.765l-.4-.968a1 1 0 1 1 1.848-.765M5.383 7.076l.968.401a1.001 1.001 0 0 1-.766 1.848l-.968-.4a1.001 1.001 0 0 1 .766-1.848m9.932 10.413a1.003 1.003 0 0 0-.542 1.307l.402.968A1 1 0 1 0 17.023 19l-.401-.967a1 1 0 0 0-1.307-.542zm2.176-2.174a1 1 0 0 0 .54 1.306l.969.401a1.001 1.001 0 0 0 .766-1.848l-.969-.4a1 1 0 0 0-1.306.542z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

UnlinkIcon.displayName = 'UnlinkIcon';
var _default = UnlinkIcon;
exports.default = _default;