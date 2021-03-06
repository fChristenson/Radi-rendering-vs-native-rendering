/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["r"] = r;
/* harmony export (immutable) */ __webpack_exports__["component"] = component;
/* harmony export (immutable) */ __webpack_exports__["cond"] = cond;
/* harmony export (immutable) */ __webpack_exports__["l"] = l;
/* harmony export (immutable) */ __webpack_exports__["ll"] = ll;
/* harmony export (immutable) */ __webpack_exports__["freeze"] = freeze;
/* harmony export (immutable) */ __webpack_exports__["unfreeze"] = unfreeze;
/* harmony export (immutable) */ __webpack_exports__["use"] = use;
/* harmony export (immutable) */ __webpack_exports__["register"] = register;
const version = '0.1.8'
/* harmony export (immutable) */ __webpack_exports__["version"] = version;


// var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
var STRIP_COMMENTS = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/mg
var FIND_L = /\bl\(/g
var RL = '('.charCodeAt(0)
var RR = ')'.charCodeAt(0)

var frozenState = false
var registered = {}
var mix = {}

function isArray (o) { return Array.isArray(o) === true }

if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

function clone(obj) {
	var i, ret, ret2;
	if (typeof obj === "object") {
		if (obj === null) return obj;
		if (Object.prototype.toString.call(obj) === "[object Array]") {
			var len = obj.length;
			ret = new Array(len);
			for (i = 0; i < len; i++) {
				if (typeof obj[i] === "object") {
					ret[i] = clone(obj[i]);
				} else {
					ret[i] = obj[i];
				}
			}
		} else {
			ret = {};
			for (i in obj) {
				if (obj.hasOwnProperty(i)) {
					if (typeof(obj[i] === "object")) {
						ret[i] = clone(obj[i]);
					} else {
						ret[i] = obj[i];
					}
				}
			}
		}
	} else {
		ret = obj;
	}

	return ret;
}

function createElement(query, ns) {
	return ns ? document.createElementNS(ns, query) : document.createElement(query);
}

function arrayMods (v, s) {
	if (!isArray(v) || v.__radi) return false
	return Object.defineProperties(v, {
		__radi: { value: true },
		reverse: { value: s.bind('reverse') },
		push: { value: s.bind('push') },
		splice: { value: s.bind('splice') },
		pop: { value: s.bind('pop') },
		shift: { value: s.bind('shift') }
	})
}

var ids = 0;
const activeComponents = [];
/* harmony export (immutable) */ __webpack_exports__["activeComponents"] = activeComponents;


function Radi(o) {
	var SELF = {
		__path: 'this'
	}

  // apply mixins
	for (var i in o.$mixins) {
		if (typeof SELF[i] === 'undefined') {
			SELF[i] = o.$mixins[i]
		}
	}

	Object.defineProperties(SELF, {
		$mixins: {
			enumerable: false,
			value: o.$mixins,
		},
		$mixins_keys: {
			enumerable: false,
			value: new RegExp('^this\\.(' + Object.keys(o.$mixins).join('|').replace(/\$/g, '\\$').replace(/\./g, '\\.') + ')'),
		},
		$e: {
			enumerable: false,
			value: {
				WATCH: {},
				get(path) {
					return SELF.$e.WATCH[path] || (SELF.$e.WATCH[path] = [])
				},
				on(path, fn) {
					if (frozenState) return null
					return SELF.$e.get(path).push(fn)
				},
				emit(path, r) {
					if (frozenState) return null
					var list = SELF.$e.get(path), len = list.length
					for (var i = 0; i < len; i++) {
						list[i](path, r)
					}
				}
			}
		}
	})

	function populate(to, path) {
		var ret
		if (typeof to !== 'object' || !to) return false;
	  ret = (typeof to.__path === 'undefined') ? Object.defineProperty(to, '__path', { value: path }) : false;
	  for (var ii in to) {
			var isMixin = SELF.$mixins_keys.test(path + '.' + ii)
	    if (to.hasOwnProperty(ii) && !Object.getOwnPropertyDescriptor(to, ii).set) {
	      if (typeof to[ii] === 'object') populate(to[ii], path + '.' + ii)
	      // Initiate watcher if not already watched
	      watcher(to, ii, path.concat('.').concat(ii))
	      // Trigger changes for this path
				SELF.$e.emit(path + '.' + ii, to[ii])
	    } else
			if (isMixin) {
				watcher(to, ii, path.concat('.').concat(ii))
			}
	  }
		return ret
	}

  // TODO: Bring back multiple watcher sets
	var dsc = Object.getOwnPropertyDescriptor
	function watcher(targ, prop, path) {
	  var oldval = targ[prop],
			prev = (typeof dsc(targ, prop) !== 'undefined') ? dsc(targ, prop).set : null,
			setter = function (newval) {
	      if (oldval !== newval) {
	        if (Array.isArray(oldval)) {
						var ret;
	          if (this && this.constructor === String) {
							ret = Array.prototype[this].apply(oldval, arguments)
						} else {
							oldval = newval;
							arrayMods(oldval, setter);
	          }

						populate(oldval, path);
						SELF.$e.emit(path, oldval);
						if (typeof prev === 'function') prev(newval)
						return ret;
	        } else if (typeof newval === 'object') {
						oldval = clone(newval)
						populate(oldval, path);
						SELF.$e.emit(path, oldval);
	        } else {
	          oldval = newval
						populate(oldval, path);
						SELF.$e.emit(path, oldval);
	        }
					if (typeof prev === 'function') prev(newval)
	        return newval
	      } else {
	        return false
	      }
	    }

	  if (Array.isArray(oldval)) arrayMods(oldval, setter);

	  if (delete targ[prop]) {
	    Object.defineProperty(targ, prop, {
	      get: function () {
	        return oldval;
	      },
	      set: setter,
	      enumerable: true,
	      configurable: true
	    })
	  }
	}

	for (var i in o.state) {
		if (typeof SELF[i] === 'undefined') {
			SELF[i] = o.state[i];
		} else {
			throw new Error('[Radi.js] Err: Trying to write state for reserved variable `' + i + '`');
		}
	}

	for (var i in o.props) {
		if (typeof SELF[i] === 'undefined') {
			if (isWatchable(o.props[i])) {
				SELF[i] = o.props[i].get();

				if (o.props[i].parent) {
					o.props[i].parent().$e.on(o.props[i].path, (e, a) => {
						SELF[i] = a;
					})
				}
			} else {
				SELF[i] = o.props[i];
			}
		} else {
			throw new Error('[Radi.js] Err: Trying to write prop for reserved variable `' + i + '`');
		}
	}

	populate(SELF, 'this');

	for (var i in o.actions) {
		if (typeof SELF[i] === 'undefined') {
			SELF[i] = (function() {
				if (frozenState) return null
				return o.actions[this].apply(SELF, arguments)
			}).bind(i);
		} else {
			throw new Error('[Radi.js] Error: Trying to write action for reserved variable `' + i + '`');
		}
	}

	Object.defineProperties(SELF, {
		$id: {
			enumerable: false,
			value: ids++
		},
		$name: {
			enumerable: false,
			value: o.name
		},
		$state: {
			enumerable: false,
			value: o.state || {}
		},
		$props: {
			enumerable: false,
			value: o.props || {}
		},
		$actions: {
			enumerable: false,
			value: o.actions || {}
		},
		$html: {
			enumerable: false,
			value: document.createDocumentFragment()
		},
		$parent: {
			enumerable: false,
			value: null
		},
		$view: {
			enumerable: false,
			value: new Function('r','list','ll','cond','return ' + o.$view)(
				r.bind(SELF), list.bind(SELF), ll.bind(SELF), cond.bind(SELF)
			)
		},
		$render: {
			enumerable: false,
			value: function() {
				SELF.mount()
				return SELF.$html
			}
		},
	});

	Object.defineProperties(SELF, {
		$link: {
			enumerable: false,
			value: SELF.$view()
		}
	});

	SELF.$html.appendChild(SELF.$link)

	SELF.$html.destroy = function () {
		const oldRootElem = SELF.$link.parentElement;
		const newRootElem = oldRootElem.cloneNode(false);
		oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
		SELF.unmount();
		oldRootElem.parentNode.removeChild(oldRootElem);
	}

	SELF.mount = function () {
		if (typeof SELF.$actions.onMount === 'function') {
			SELF.$actions.onMount.call(SELF)
		}
		activeComponents.push(SELF);
	}

	SELF.unmount = function () {
		if (typeof SELF.$actions.onDestroy === 'function') {
			SELF.$actions.onDestroy.call(SELF)
		}
		for (var i = 0; i < activeComponents.length; i++) {
			if (activeComponents[i].$id === SELF.$id) {
				activeComponents.splice(i, 1);
				break;
			}
		}
		return SELF.$link;
	}

	SELF.$link.unmount = SELF.unmount.bind(SELF)
	SELF.$link.mount = SELF.mount.bind(SELF)

	return SELF
}

function unmountAll(el) {
	if (typeof el.unmount === 'function') el.unmount()
	if (el.children && el.children.length > 0) {
		for (var i = 0; i < el.children.length; i++) {
			unmountAll(el.children[i])
		}
	}
}

function mountAll(el) {
	if (typeof el.mount === 'function') el.mount()
	if (el.children && el.children.length > 0) {
		for (var i = 0; i < el.children.length; i++) {
			mountAll(el.children[i])
		}
	}
}

// var pl = 0
// var lock = false
// var pipequeued = false
// var pipeline = {}
//
// function render() {
// 	lock = true
// 	for (var i in pipeline) {
// 		pipeline[i]()
// 	}
// 	pipeline = {}
// 	pl = 0
// 	lock = false
// 	pipequeued = false
// }

function radiMutate(c, key, type) {
	c();
	// if (!lock) {
	// 	pipeline[key + '-' + type] = c
	// 	if (!pipequeued) setTimeout(render)
	// 	pipequeued = true
	// }
}

function setStyle(view, arg1, arg2) {
	var self = this;
	var el = getEl(view);

	if (isWatchable(arg2)) {
		var cache = arg2.get();
		el.style[arg1] = cache;

		// Update bind
		(function(cache, arg1, arg2){
			self.$e.on(arg2.path, function(e, v) {
				if (v === cache) return false
				radiMutate(() => {
					el.style[arg1] = v
				}, el.key, 'style');
				cache = v;
			});
		})(cache, arg1, arg2);
	} else if (arg2 !== undefined) {
		el.style[arg1] = arg2;
	} else if (isString(arg1)) {
		el.setAttribute('style', arg1);
	} else {
		for (var key in arg1) {
			setStyle.call(this, el, key, arg1[key]);
		}
	}
};

function setAttr(view, arg1, arg2) {
	var self = this;
	var el = getEl(view);

	if (arg2 !== undefined) {
		if (arg1 === 'style') {
			setStyle.call(this, el, arg2);
		} else if (arg1 === 'model' && isWatchable(arg2)) {
			var cache = arg2.get()
			el.value = cache;
			el['oninput'] = function () { arg2.set(el.value); cache = el.value; self.$e.emit(arg2.path, el.value) };
			// Update bind
			(function(cache, arg1, arg2){
				self.$e.on(arg2.path, function(e, v) {
					if (v === cache) return false
					radiMutate(() => {
						el.value = v;
					}, el.key, 'attr1');
					cache = v;
				});
			})(cache, arg1, arg2);
		} else if (isFunction(arg2)) {
			el[arg1] = function (e) { arg2.call(self, e); };
		} else if (isWatchable(arg2)) {
			var temp = arg2.get()
			if (isFunction(temp)) {
				el[arg1] = function (e) { arg2.get().call(self, e); };
			} else {
				var cache = arg2.get();
				if (cache !== false)
					if (arg1 === 'html') {
						el.innerHTML = cache;
					} else {
						el.setAttribute(arg1, cache);
					}

				// Update bind
				(function(cache, arg1, arg2){
					self.$e.on(arg2.path, function(e, v) {
						if (v === cache) return false
						radiMutate(() => {
							if (v !== false) {
								if (arg1 === 'html') {
									el.innerHTML = v;
								} else {
									el.setAttribute(arg1, v);
								}
							} else {
								el.removeAttribute(arg1);
							}
						}, el.key, 'attr2');
						cache = v;
					});
				})(cache, arg1, arg2);
			}
		} else {
			if (cache !== false)
				if (arg1 === 'html') {
					el.innerHTML = arg2;
				} else {
					el.setAttribute(arg1, arg2);
				}
		}
	} else {
		for (var key in arg1) {
			setAttr.call(this, el, key, arg1[key]);
		}
	}
};

var ensureEl = function (parent) { return isString(parent) ? html(parent) : getEl(parent); };
var getEl = function (parent) { return (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el); };

var isString = function (a) { return typeof a === 'string'; };
var isNumber = function (a) { return typeof a === 'number'; };
var isFunction = function (a) { return typeof a === 'function'; };

var isNode = function (a) { return a && a.nodeType; };
var isWatchable = function (a) { return a && a instanceof NW; };
var isCondition = function (a) { return a && a instanceof Condition; };
var isComponent = function (a) { return a && a.__radi; };

const text = function (str) { return document.createTextNode(str); };
/* harmony export (immutable) */ __webpack_exports__["text"] = text;


function radiArgs(element, args) {
	var self = this
	for (var i = 0; i < args.length; i++) {
		var arg = args[i];

		if (arg !== 0 && !arg) {
			continue;
		}

		// support middleware
		if (isComponent(arg)) {
			element.appendChild(arg.__radi().$render());
		} else if (isCondition(arg)) {
			var arg2 = arg.__do(), a, id = arg2.id
			if (isComponent(arg2.r)) {
				a = arg2.r.__radi().$render();
			} else if (typeof arg2.r === 'function') {
				a = arg2.r();
			} else if (isString(arg2.r) || isNumber(arg2.r)) {
				a = text(arg2.r);
			} else {
				a = arg2.r;
			}
			element.appendChild(a);
			(function(arg){
				arg.watch(function(v) {
					var arg2 = arg.__do(), b
					if (id === arg2.id) return false
					if (isComponent(arg2.r)) {
						b = arg2.r.__radi().$render();
					} else if (typeof arg2.r === 'function') {
						b = arg2.r();
					} else if (isString(arg2.r) || isNumber(arg2.r)) {
						b = text(arg2.r);
					} else {
						b = arg2.r;
					}
					unmountAll(a)
					a.parentNode.replaceChild(b, a)
					a = b
					mountAll(a)
					id = arg2.id
				})
			})(arg)
		} else if (typeof arg === 'function') {
			arg.call(this, element);
		} else if (isString(arg) || isNumber(arg)) {
			element.appendChild(text(arg));
		} else if (isNode(getEl(arg))) {
			element.appendChild(arg);
		} else if (Array.isArray(arg)) {
			radiArgs.call(this, element, arg);
		} else if (isWatchable(arg)) {
			var cache = arg.get();
			let z = text(cache);
			element.appendChild(z);

			// Update bind
			(function(cache, arg){
				self.$e.on(arg.path, function(e, v) {
					if (v === cache) return false
					radiMutate(() => {
						z.textContent = v;
					}, element.key, 'text');
					cache = v;
				});
			})(cache, arg);
		} else if (typeof arg === 'object') {
			setAttr.call(this, element, arg);
		}

	}
}

var htmlCache = {};

function memoizeHTML(query) { return htmlCache[query] || (htmlCache[query] = createElement(query)); };

var rkeys = 0

function r(query) {
	var args = [], len = arguments.length - 1;
	while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	var element;

	if (isString(query)) {
		if (typeof registered[query] !== 'undefined') {
      // TODO: Make props and childs looped,
			// aka don't assume that first obj are props
			var props = args[0] || {}
			return element = new registered[query]().props(props);
		} else {
			element = memoizeHTML(query).cloneNode(false);
		}
	} else if (isNode(query)) {
		element = query.cloneNode(false);
	} else {
		element = document.createDocumentFragment();
	}

	element.key = rkeys
	rkeys += 1

	radiArgs.call(this, element, args);

	return element;
};
r.extend = function (query) {
	var args = [], len = arguments.length - 1;
	while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	var clone = memoizeHTML(query);

	return r.bind.apply(r, [ this, clone ].concat( args ));
};

function component(o) {
	var fn = o.view.toString().replace(STRIP_COMMENTS, ''),
		match = FIND_L.exec(fn),
		cursor = 0;
	o.$view = '';

	while (match !== null) {
		var n = match.index,
			all = match.input,
			_l = 1,
			_r = 0

		const len = all.length;

		for (var i = n + 2; i < len; i++) {
			var char = all.charCodeAt(i);
			if (char === RL) {
				_l += 1;
			} else
			if (char === RR) {
				_r += 1;
			}
			if (_l === _r) break;
		}

		var found = all.substr(n, i + 1 - n);

		var m = found.match(/[a-zA-Z_$]+(?:\.[a-zA-Z_$]+(?:\[.*\])?)+/g) || [];
		// var obs = (m.length > 0) ? m.join('__ob__,') + '__ob__' : '';
		var obs = []
		for (var i = 0; i < m.length; i++) {
			var temp = m[i].split('.')
			if (temp.length > 1) {
				var last = temp.splice(-1)[0]
				obs.push('[' + temp.join('.') + ', "' + last + '"]')
			}
		}
		var obs = obs.join(',');
		var newString = 'll(function(){ return ' + found.substr(1) + '; },[' + obs + '], "' + m.join(',') + '")';

		o.$view = o.$view.concat(fn.substr(cursor, n - cursor)).concat(newString);
		cursor = n + found.length;

		match = FIND_L.exec(fn);
	}
	o.$view = o.$view.concat(fn.substr(cursor, fn.length - cursor));

	return Component.bind(this, o);
};
function Component(o) {
	this.o = {
		name: o.name,
		state: clone(o.state),
		props: clone(o.props),
		actions: o.actions,
		view: o.view,
		$view: o.$view,
		$mixins: this.$mixins || {},
	};

	this.__radi = function() { return new Radi(this.o); };
};
Component.prototype.props = function props(p) {
	for (var k in p) {
		if (typeof this.o.props[k] === 'undefined') {
			console.warn('[Radi.js] Warn: Creating a prop `', k, '` that is not defined in component');
		}
		this.o.props[k] = p[k];
	}
	return this;
};
Component.prototype.$mixins = {}

const mount = function (comp, id) {
	const where = (id.constructor === String) ? document.getElementById(id) : id;
	var out = (comp instanceof Component) ? comp.__radi().$render() : comp;
	where.appendChild(out);
	return out;
}
/* harmony export (immutable) */ __webpack_exports__["mount"] = mount;


var emptyNode = text('');

const list = function (data, act) {
	if (!data) return '';
	var SELF = this;

	var link, fragment = document.createDocumentFragment(), toplink = emptyNode.cloneNode();

	fragment.appendChild(toplink);

	var ret = [];
	var cache = data.source[data.prop] || []
	var cacheLen = cache.length || 0

	if (isArray(cache)) {
		for (var i = 0; i < cacheLen; i++) {
			fragment.appendChild(
				act.call(SELF, cache[i], i)
			)
		}
	} else {
		var i = 0
		for (var key in cache) {
			fragment.appendChild(
				act.call(SELF, cache[key], key, i)
			)
			i++
		}
	}

	link = fragment.lastChild;

	var w = function(a, b) {
		if (a > 0) {
			var len = b.length
			var start = len - a
			for (var i = start; i < len; i++) {
				fragment.appendChild(
					act.call(SELF, b[i], i)
				)
			}
			var temp = fragment.lastChild
			link.parentElement.insertBefore(fragment, link.nextSibling)
			link = temp
		} else
		if (a < 0) {
			for (var i = 0; i < Math.abs(a); i++) {
				var templink = link.previousSibling
				link.parentElement.removeChild(link)
				link = templink
			}
		}
	}

	if (cache.__path) {
		var len = cacheLen;
		SELF.$e.on(cache.__path, function(e, v) {
			w(v.length - len, v)
			len = v.length
		})
	}

	return fragment;
}
/* harmony export (immutable) */ __webpack_exports__["list"] = list;


function set(path, source, value) {
	if (typeof path === 'string') path = path.split('.')
	path.shift()
	var prop = path.splice(-1)
	for (var i = 0; i < path.length; i++) {
		source = source[path[i]]
	}
	return source[prop] = value
}

function NW(source, prop, parent) {
  this.path = source.__path + '.' + prop;
  this.get = () => (source[prop]);
  this.set = (value) => (set(this.path.split('.'), parent(), value));
  this.source = source;
  this.prop = prop;
  this.parent = parent;
}

var linkNum = 0;

const link = function (fn, watch, txt) {
	var args = {s: null,a: [],t: [],f: fn.toString()}, SELF = this;

	if (txt.length === 1 && fn.toString()
				.replace(/(function \(\)\{ return |\(|\)|\; \})/g, '')
				.trim() === txt[0]) {
		return new NW(watch[0][0], watch[0][1], function () { return SELF; })
	}

	var len = watch.length

	args.s = fn.call(this);
	args.a = new Array(len);
	args.t = new Array(len);
	args.__path = '$link-' + linkNum;
	linkNum += 1;

	for (var i = 0; i < len; i++) {
		args.a[i] = watch[i][0][watch[i][1]];
		args.t[i] = '$rdi[' + i + ']';
		args.f = args.f.replace(txt[i], args.t[i]);
		// args.f = args.f.replace(new RegExp(txt[i], 'g'), args.t[i]);
		(function(path, args, p, i) {
			SELF.$e.on(path, (e, v) => {
				args.a[i] = v;
				var cache = args.f.call(SELF, args.a)

				if (args.s !== cache) {
					args.s = cache;
					SELF.$e.emit(p, args.s);
				}
			});
		})(watch[i][0].__path + '.' + watch[i][1], args, args.__path + '.s', i)
	}

	args.f = new Function('$rdi', 'return ' + args.f + '();')

	if (len <= 0) return args.s;
	return new NW(args, 's', function () { return SELF; });
}
/* harmony export (immutable) */ __webpack_exports__["link"] = link;


function cond (a, e) {
	return new Condition(a, e, this)
}
function Condition (a, e, SELF) {
	this.cases = [{a:a,e:e}]
	this.w = []
	this.cache = []
	this.els = emptyNode.cloneNode()

	if (isWatchable(a)) { this.w.push(a) }

	this.watch = function(cb) {
		for (var w in this.w) {
			(function(w) {
				SELF.$e.on(this.w[w].path, (e, v) => {
					cb(v)
				})
			}).call(this,w)
		}
	}

	this.__do = function() {
		var ret = {id: null}
		for (var c in this.cases) {
			var a = isWatchable(this.cases[c].a) ? this.cases[c].a.get() : this.cases[c].a
			if (a) {
				ret.id = c
				ret.r = this.cases[c].e
				break
			}
		}
		if (typeof ret.r === 'undefined') ret.r = this.els
		return ret
	}
}
Condition.prototype.elseif = function (a, e) {
	this.cases.push({a:a,e:e})
	if (isWatchable(a)) { this.w.push(a) }
	return this
}
Condition.prototype.cond = Condition.prototype.elseif
Condition.prototype.else = function (e) {
	this.els = e
	return this
}

function l (f) {
	return f
}

function ll (f, w, c) {
	if (!w) {
		return f
	} else {
		return link.call(this, f, w, c.split(','))
	}
}

function freeze () {
	frozenState = true
}
function unfreeze () {
	frozenState = false

	for (var ii = 0; ii < activeComponents.length; ii++) {
		if (typeof activeComponents[ii].onMount === 'function') {
			activeComponents[ii].onMount.call(activeComponents[ii])
		}
	}
}

const pack = {
	version: version,
	activeComponents: activeComponents,
	r: r,
	l: l,
	cond: cond,
	component: component,
	mount: mount,
	freeze: freeze,
	unfreeze: unfreeze,
}

window.$Radi = pack

const mixin = function(n, m) {
	return Component.prototype.$mixins[n] = m
}

function use (plugin) {
	return plugin(pack, mixin)
}

function register (c) {
	var cmp = new c()
	var n = cmp.o.name
	if (!n) {
		console.warn('[Radi.js] Warn: Cannot register component without name');
	} else {
		if (typeof registered[n] !== 'undefined')
			console.warn('[Radi.js] Warn: Component with name \'' + n + '\' beeing replaced');
		registered[n] = c
	}
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/** @jsx r **/
const { r, mount, component } = __webpack_require__(0);

const items = [];
for (let i = 0; i < 100; i++) {
  items.push(i);
}

const main = component({
  view: function () {
    return r(
      "ul",
      null,
      this.items.map(item => r(
        "li",
        null,
        item,
        " "
      ))
    );
  },
  state: {
    items
  }
});

console.time();
mount(new main(), document.body);
console.timeEnd();

/***/ })
/******/ ]);