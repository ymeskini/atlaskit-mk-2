'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../../es5/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditorTaskIcon = function EditorTaskIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M7.5 6h9A1.5 1.5 0 0 1 18 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 16.5v-9A1.5 1.5 0 0 1 7.5 6zm3.072 8.838l.143.154a.5.5 0 0 0 .769-.042l.13-.175 3.733-5.045a.8.8 0 0 0-.11-1.064.665.665 0 0 0-.984.118l-3.243 4.387-1.315-1.422a.663.663 0 0 0-.99 0 .801.801 0 0 0 0 1.07l1.867 2.019z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
EditorTaskIcon.displayName = 'EditorTaskIcon';
exports.default = EditorTaskIcon;