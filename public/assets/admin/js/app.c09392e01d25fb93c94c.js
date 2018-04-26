/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + "." + {}[chunkId] + ".js"
/******/ 	}
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./resources/assets/admin/js/app.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/assets/admin/js/app.js":
/*!******************************************!*\
  !*** ./resources/assets/admin/js/app.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _react = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n\nvar _reactRouterDom = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/es/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar App = function App() {\n    return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(Header, null),\n        _react2.default.createElement(SideBar, null),\n        _react2.default.createElement(Main, null)\n    );\n};\n\nvar Header = function Header() {\n    return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n            'h1',\n            null,\n            'Header'\n        )\n    );\n};\n\nvar SideBar = function SideBar() {\n    return _react2.default.createElement(\n        'div',\n        null,\n        'left nav',\n        _react2.default.createElement(\n            'nav',\n            null,\n            _react2.default.createElement(\n                'ul',\n                null,\n                _react2.default.createElement(\n                    'li',\n                    null,\n                    _react2.default.createElement(\n                        _reactRouterDom.Link,\n                        { to: '/admin/' },\n                        'Dashboard'\n                    )\n                ),\n                _react2.default.createElement(\n                    'li',\n                    null,\n                    _react2.default.createElement(\n                        _reactRouterDom.Link,\n                        { to: '/admin/films' },\n                        'Films'\n                    )\n                ),\n                _react2.default.createElement(\n                    'li',\n                    null,\n                    _react2.default.createElement(\n                        _reactRouterDom.Link,\n                        { to: { pathname: '/admin/films/7' } },\n                        'Film 7'\n                    )\n                )\n            )\n        )\n    );\n};\n\nvar Dashboard = function Dashboard() {\n    return _react2.default.createElement(\n        'h1',\n        null,\n        'Dashboard'\n    );\n};\n\nvar List = function List() {\n    return _react2.default.createElement(\n        'h1',\n        null,\n        'List'\n    );\n};\n\nvar Show = function Show(props) {\n    return _react2.default.createElement(\n        'h1',\n        null,\n        'Show ',\n        '' + props.match.params.id\n    );\n};\n\nvar Films = function Films() {\n    return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n            'h2',\n            null,\n            'Films'\n        ),\n        _react2.default.createElement(\n            _reactRouterDom.Switch,\n            null,\n            _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/admin/films', component: List }),\n            _react2.default.createElement(_reactRouterDom.Route, { path: '/admin/films/:id', component: Show })\n        )\n    );\n};\n\nvar Main = function Main() {\n    return _react2.default.createElement(\n        _reactRouterDom.Switch,\n        null,\n        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/admin/', component: Dashboard }),\n        _react2.default.createElement(_reactRouterDom.Route, { path: '/admin/films', component: Films })\n    );\n};\n\n(0, _reactDom.render)(_react2.default.createElement(\n    _reactRouterDom.BrowserRouter,\n    null,\n    _react2.default.createElement(App, null)\n), document.getElementById('app'));\n\n//# sourceURL=webpack:///./resources/assets/admin/js/app.js?");

/***/ })

/******/ });