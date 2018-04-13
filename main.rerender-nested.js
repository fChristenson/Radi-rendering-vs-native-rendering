/** @jsx r **/
const { r, mount, component } = require("radi");

const items = [];
for (let i = 0; i < 100; i++) {
  items.push(i);
}

function deepNest(content, times) {
  if (times === 0) {
    return <span>{content}</span>;
  } else {
    return deepNest(<span>{content}</span>, --times);
  }
}

const main = component({
  actions: {
    deepNest: function(content, times) {
      if (times === 0) {
        return <span>{content}</span>;
      } else {
        return deepNest(<span>{content}</span>, --times);
      }
    }
  },
  view: function() {
    return (
      <ul>
        {this.items.map(item => <li>{this.deepNest(item, 100)}</li>)}
      </ul>
    );
  },
  state: {
    items
  }
});

console.time();
mount(new main(), document.body);
console.timeEnd();
