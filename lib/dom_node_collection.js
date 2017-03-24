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
