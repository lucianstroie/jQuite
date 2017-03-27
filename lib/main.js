const DOMNodeCollection = require('./dom_node_collection.js');

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
