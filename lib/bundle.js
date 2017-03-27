/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	const queue = [];

	function executeQueue() {
	  queue.forEach((callback) => callback());
	}

	function selectorFunction(oneArg) {

	  if (oneArg instanceof HTMLElement) {
	    return new DOMNodeCollection([oneArg]);
	  } else if (oneArg instanceof Function) {
	    queue.push(oneArg);

	    document.addEventListener("DOMContentLoaded", executeQueue);
	    return;
	  }

	  let outputArr = [];
	  document.querySelectorAll(oneArg).forEach((el) => outputArr.push(el));
	  return new DOMNodeCollection(outputArr);
	}

	window.$l = selectorFunction;


	window.$l.extend = (base, ...otherObjs) => {
	  otherObjs.forEach( obj => {
	    for(let prop in obj){
	      base[prop] = obj[prop];
	    }
	  });
	  return base;
	};

	window.$l.ajax = options => {
	  const request = new XMLHttpRequest();
	  const defaults = {
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    method: "GET",
	    url: "",
	    success: () => {},
	    error: () => {},
	    data: {},
	  };
	  options = window.$l.extend(defaults, options);
	  options.method = options.method.toUpperCase();

	  return new Promise((then, reject) => {
	    request.open(options.method, options.url, true);
	    request.onload = e => {
	      if (request.status === 200) {

	        options.success(JSON.parse(request.response));
	        then(JSON.parse(request.response));
	      } else {
	        options.error(JSON.stringify(options.data));
	        reject(JSON.stringify(request.response));
	      }
	    };

	  request.send(options.data);
	});
	};

	const toQueryString = obj => {
	  let result = "";
	  for(let prop in obj){
	    if (obj.hasOwnProperty(prop)){
	      result += prop + "=" + obj[prop] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
	};

	// $('div')


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(htmlArr) {
	    this.htmlArr = htmlArr;
	  }

	  html(string = null) {
	    if (typeof(string) === 'string' ) {
	      this.htmlArr.forEach( (DOMObj) => DOMObj.innerHTML = string);
	      return;
	    } else {
	      return this.htmlArr[0].innerHTML;
	    }
	  }

	  empty() {
	    this.html('');
	  }

	  append(children) {
	    if (typeof(children) === 'string') {
	      this.htmlArr.forEach((DOMObj) => DOMObj.innerHTML += children);
	    } else if (children instanceof DOMNodeCollection) {
	      this.htmlArr.forEach((DOMObj) => {
	      children.htmlArr.forEach((internalDOM) => DOMObj.innerHTML += internalDOM.outerHTML);
	      });
	    } else if (children instanceof HTMLElement) {
	      this.htmlArr.forEach((DOMObj) => DOMObj.innerHTML += children.outerHTML);
	    } else {
	      console.log('Error, unrecognized type.');
	    }
	  }

	  attr(keyword, value) {
	    if (typeof value === 'string') {
	      this.htmlArr.forEach(node => node.setAttribute(keyword, value));
	    } else {
	      return this.htmlArr[0].getAttribute(keyword);
	    }
	  }

	  addClass(classToAdd) {
	    this.htmlArr.forEach((DOMObj) => DOMObj.className += ` ${classToAdd}`);
	  }

	  removeClass(classToRemove) {
	    this.htmlArr.forEach((DOMObj) => {
	      let newClassArr = [];
	      DOMObj.className.split(' ').forEach((className) => {if (className !== classToRemove) newClassArr.push(className);});
	      DOMObj.className = newClassArr.join(' ');
	    });
	  }

	  children() {
	    let allChildren = [];
	    this.htmlArr.forEach((DOMObj) => {
	      allChildren.push.apply(allChildren, DOMObj.children);
	    });
	    return new DOMNodeCollection(allChildren);
	  }

	  parent() {
	    let allParents = [];
	    this.htmlArr.forEach((DOMObj) => allParents.push(DOMObj.parentNode));
	    return new DOMNodeCollection(allParents);
	  }

	  find (selector) {
	    const selectedArr = [];
	    this.htmlArr.forEach((DOMObj) => {
	      selectedArr.push.apply(selectedArr, DOMObj.querySelectorAll(selector));
	    });
	    return new DOMNodeCollection(selectedArr);
	  }

	  remove () {
	    this.htmlArr.forEach((DOMObj) => {
	      DOMObj.remove();
	    });
	    this.htmlArr = [];
	  }

	  on (type, listener) {
	    this.htmlArr.forEach((DOMObj) => {
	      DOMObj.addEventListener(type, listener);
	      DOMObj.eventArr = DOMObj.eventArr || [];
	      DOMObj.eventArr.push(listener);
	    });
	  }

	  off(type) {
	    this.htmlArr.forEach((DOMObj) => {
	      if (DOMObj.eventArr === undefined) {
	        return;
	      }
	      DOMObj.eventArr.forEach((listener) => {
	        DOMObj.removeEventListener(type, listener);
	      });
	    });
	  }
	}

	module.exports = DOMNodeCollection;


	// arg = "<a href="asdas">LINK CLICK ME</a>"
	// arg.outerHTML = "<a href="asdas">LINK CLICK ME</a>"
	//
	//
	// DOMObj = "<body> </body>"
	// DOMObj.innerHTML = " "<a href="asdas">LINK CLICK ME</a>""


/***/ }
/******/ ]);
