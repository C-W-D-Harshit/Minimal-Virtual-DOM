// 1. Create virtual nodes
function h(type, props = {}, ...children) {
  return { type, props, children: children.flat() };
}

// 2. Render vnode to real DOM
function render(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.type);

  for (const [key, val] of Object.entries(vnode.props)) {
    if (key.startsWith("on")) {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === "style" && typeof val === "object") {
      // Handle style objects
      for (const [styleKey, styleVal] of Object.entries(val)) {
        el.style[styleKey] = styleVal;
      }
    } else {
      el.setAttribute(key, val);
    }
  }

  for (const child of vnode.children) {
    el.appendChild(render(child));
  }

  return el;
}

// 3. Diff and patch
function diff(parent, oldVNode, newVNode, index = 0) {
  const el = parent.childNodes[index];

  // No old node - create new
  if (!oldVNode) {
    parent.appendChild(render(newVNode));
    return;
  }

  // No new node - remove old
  if (!newVNode) {
    parent.removeChild(el);
    return;
  }

  // Different type or text changed - replace
  if (
    typeof oldVNode !== typeof newVNode ||
    (typeof newVNode === "string" && oldVNode !== newVNode) ||
    oldVNode.type !== newVNode.type
  ) {
    parent.replaceChild(render(newVNode), el);
    return;
  }

  // Same element - diff props and children
  if (typeof newVNode !== "string") {
    // Diff props
    const allProps = new Set([
      ...Object.keys(oldVNode.props || {}),
      ...Object.keys(newVNode.props || {}),
    ]);
    for (const key of allProps) {
      const oldVal = oldVNode.props[key];
      const newVal = newVNode.props[key];
      if (oldVal !== newVal) {
        if (key.startsWith("on")) {
          // Remove old listener and add new one
          el.removeEventListener(key.slice(2).toLowerCase(), oldVal);
          el.addEventListener(key.slice(2).toLowerCase(), newVal);
        } else if (key === "style" && typeof newVal === "object") {
          // Update style object
          if (typeof oldVal === "object") {
            // Remove old styles that are not in new styles
            for (const styleKey of Object.keys(oldVal)) {
              if (!(styleKey in newVal)) {
                el.style[styleKey] = "";
              }
            }
          }
          // Apply new styles
          for (const [styleKey, styleVal] of Object.entries(newVal)) {
            el.style[styleKey] = styleVal;
          }
        } else {
          el.setAttribute(key, newVal);
        }
      }
    }

    // Diff children
    const max = Math.max(oldVNode.children.length, newVNode.children.length);
    for (let i = 0; i < max; i++) {
      diff(el, oldVNode.children[i], newVNode.children[i], i);
    }
  }
}
