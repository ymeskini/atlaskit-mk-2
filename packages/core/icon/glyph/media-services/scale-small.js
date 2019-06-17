"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesScaleSmallIcon = function MediaServicesScaleSmallIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M8 8.575v6.85a.57.57 0 0 0 .575.575h6.85a.57.57 0 0 0 .575-.575v-6.85A.57.57 0 0 0 15.425 8h-6.85A.57.57 0 0 0 8 8.575zm-2 0A2.57 2.57 0 0 1 8.575 6h6.85A2.57 2.57 0 0 1 18 8.575v6.85A2.57 2.57 0 0 1 15.425 18h-6.85A2.57 2.57 0 0 1 6 15.425v-6.85z\" fill-rule=\"nonzero\"/><path d=\"M11.425 14.857h3.146a.29.29 0 0 0 .286-.29v-.935a.424.424 0 0 0-.1-.256l-1.324-1.456c-.062-.069-.145-.065-.201-.01l-1.803 1.804-.47-.469a.141.141 0 0 0-.204 0L9.34 14.66c-.105.105-.066.197.095.197h1.99z\"/><circle cx=\"10.286\" cy=\"10.286\" r=\"1.143\"/></g></svg>"
  }, props));
};

MediaServicesScaleSmallIcon.displayName = 'MediaServicesScaleSmallIcon';
var _default = MediaServicesScaleSmallIcon;
exports.default = _default;