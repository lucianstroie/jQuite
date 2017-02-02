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
    if (document.readyState === "complete") {
      
    }
    document.addEventListener("DOMContentLoaded", executeQueue);
    return;
  }

  let outputArr = [];
  document.querySelectorAll(oneArg).forEach((el) => outputArr.push(el));
  return new DOMNodeCollection(outputArr);
}

window.$l = selectorFunction;
// $('div')
