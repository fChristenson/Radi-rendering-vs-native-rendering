const rootDiv = document.querySelector("#root");
const items = ["foo", "bar", "baz"];
// rendering
console.time();
const liArray = items.map(str => {
  const li = document.createElement("li");
  const text = document.createTextNode(str);
  li.appendChild(text);
  return li;
});
let ul = document.createElement("ul");
ul = liArray.reduce((acc, li) => {
  acc.appendChild(li);
  return acc;
}, ul);
rootDiv.appendChild(ul);
console.timeEnd();
// end rendering
