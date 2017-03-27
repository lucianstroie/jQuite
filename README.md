# jQuite.js

A DOM manipulation library written in JavaScript for processing AJAX requests, event handling, and modifying elements.

[Live Demo](https://lucianstroie.github.io/jQuite/)

## Basic Structure

The core class of jQuite.js is `DOMNodeCollection`. It contains an array of all DOM elements and its functions use the class' `each` function to call the function on each DOM element. As an example:

```javascript
attr(attribute, value) {
  if (value === undefined) {
    return this.elements[0].getAttribute(attribute);
  } else {
    this.each( el => el.setAttribute(attribute, value) );
  }
}
```

### DOM Selection

The function `$l` is the selector. You can select DOM elements by their class, ids, or HTML element type. The result is an array of `DOMNodeCollection` objects matching the selector argument.

#### Functions

Once you have the DOM elements selected, there are a few functions you can use to manipulate them.

- `append(content)`: adds `content` to the end of the `DOMNodeCollection`'s `elements` array.
- `addClass(className)`: adds `className` to the DOM elements' class properties.
- `removeClass(className)`: removes `className` from the DOM elements' class properties.
- `attr(attribute, value)`: returns the value of the `attribute` if `value` is not provided. Otherwise, sets the value of the `attribute` to `value`.
- `children()`: returns all of the nested DOM elements as a `DOMNodeCollection`.
- `parent()`: returns the parent DOM element as a `DOMNodeCollection`.
- `remove()`: removes the DOM element from the page.
- `find(selector)`: returns the DOM elements of the children of the element
- `html(textContent)`: returns HTML content inside the element if `textContent` is not provided. Sets the HTML conent otherwise.
- `on(event, callback)`: places an event listener on the DOM element with the callback (also see `off(event)`)
- `off(event)`: removes the specified event listener on the DOM element

##### Ajax

jQuite.js also comes with an Ajax function, `$l.ajax(options)`. By default, the options are provided but the use of `$l.extend` ensures that any options passed in are preserved.

```javascript
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
```

###### Promises

`$l.ajax` returns a Promise object that allows for chaining `then` or `catch` calls. This can be confirmed by fetching a GIF in the demo page.
