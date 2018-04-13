function clearChildren(element) {
  const nodes = [...element.childNodes];

  for (const child of nodes) {
    element.removeChild(child);
  }
}

function deepNest(content, times) {
  if (times === 0) {
    const span = document.createElement("span");
    span.appendChild(content);
    return span;
  } else {
    const span = document.createElement("span");
    span.appendChild(content);
    return deepNest(span, --times);
  }
}

function render() {
  const liArray = items.map(str => {
    const li = document.createElement("li");
    const textNode = document.createTextNode(str);
    const nestedSpan = deepNest(textNode, 100);
    li.appendChild(nestedSpan);
    return li;
  });
  const ul = document.createElement("ul");
  return liArray.reduce((acc, li) => {
    acc.appendChild(li);
    return acc;
  }, ul);
}

const rootDiv = document.querySelector("#root");
const items = [];
for (let i = 0; i < 100; i++) {
  items.push(i);
}
// rendering
console.time();
let ul = render();
rootDiv.appendChild(ul);
for (let i = 0; i < 1; i++) {
  clearChildren(rootDiv);
  ul = render();
  rootDiv.appendChild(ul);
}
console.timeEnd();
// end rendering
