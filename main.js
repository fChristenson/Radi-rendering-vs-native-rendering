/** @jsx r **/
const { r, mount, component } = require("radi");

const main = component({
  view: function() {
    return (
      <ul>
        {this.items.map(item => <li>{item}</li>)}
      </ul>
    );
  },
  state: {
    items: ["foo", "bar", "baz"]
  }
});

console.time();
mount(new main(), document.body);
console.timeEnd();
