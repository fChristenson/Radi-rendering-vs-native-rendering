function clearChildren(element) {
  const nodes = [...element.childNodes];

  for (const child of nodes) {
    element.removeChild(child);
  }
}

function render() {
  const liArray = items.map(str => {
    const li = document.createElement("li");
    const text = document.createTextNode(str);
    li.appendChild(text);
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
clearChildren(rootDiv);
ul = render();
rootDiv.appendChild(ul);
console.timeEnd();
// end rendering
