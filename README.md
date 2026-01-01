# Minimal Virtual DOM

A ~100 line virtual DOM implementation for learning purposes.

## What is this?

A simple implementation of the virtual DOM concept used by libraries like React. It demonstrates the core ideas without the complexity of a production library.

## Core Concepts

1. **Virtual Nodes** - Plain objects representing DOM elements
2. **Rendering** - Converting virtual nodes to real DOM
3. **Diffing** - Comparing old and new trees, updating only what changed

## Installation

No dependencies. Just copy `vdom.js` into your project.

## API

### `h(type, props, ...children)`

Creates a virtual node.

```js
const vnode = h(
  "div",
  { class: "container" },
  h("h1", {}, "Hello"),
  h("p", {}, "World")
);

// Style objects are supported
const button = h(
  "button",
  {
    style: {
      backgroundColor: "blue",
      color: "white",
      padding: "10px 20px",
    },
    onClick: () => console.log("clicked"),
  },
  "Click me"
);
```

### `render(vnode)`

Converts a virtual node into a real DOM element.

```js
const el = render(vnode);
document.body.appendChild(el);
```

### `diff(parent, oldVNode, newVNode, index)`

Compares two virtual trees and patches the real DOM.

```js
diff(parent, oldTree, newTree, 0);
```

## Example

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="vdom.js"></script>
    <script>
      let count = 0;
      let oldTree = null;
      const root = document.getElementById("root");

      function app() {
        return h(
          "div",
          {},
          h("h1", {}, `Count: ${count}`),
          h(
            "button",
            {
              onClick: () => {
                count++;
                update();
              },
              style: {
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              },
            },
            "Increment"
          )
        );
      }

      function update() {
        const newTree = app();
        if (oldTree) {
          diff(root, oldTree, newTree, 0);
        } else {
          root.appendChild(render(newTree));
        }
        oldTree = newTree;
      }

      update();
    </script>
  </body>
</html>
```

## Limitations

This is for learning, not production. Missing features:

- No key-based list diffing
- No components or state management
- No batching
- No fragments or portals
- Synchronous rendering (blocks main thread)

## How it works

1. Create virtual nodes
2. Render virtual nodes to real DOM
3. Diff old and new virtual trees
4. Patch only changed DOM nodes
5. Save new tree for next update
