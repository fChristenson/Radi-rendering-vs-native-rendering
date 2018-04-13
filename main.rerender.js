/** @jsx r **/
const { r, mount, component } = require("radi");

const items = [];
for (let i = 0; i < 100; i++) {
  items.push(i);
}

const main = component({
  view: function() {
    return (
      <ul>
        {this.items.map(item => <li>{item}</li>)}
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
