// example of overly complicated code

function getTotal(items) {
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    if (
      typeof items[i] === "object" &&
      items[i] !== null &&
      "price" in items[i] &&
      "qty" in items[i]
    ) {
      t = t + items[i].price * items[i].qty;
    } else if (typeof items[i] === "number") {
      t = t + items[i];
    } else {
      // skip invalid
    }
  }
  return t;
}