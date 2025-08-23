// example of overly complicated code

function total(items) {
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


// Refactored, Simpler Version
function getTotal(items) {
  return items.reduce((total, item) => {
    if (typeof item === "object" && item !== null && "price" in item && "qty" in item) {
      return total + item.price * item.qty;
    } else if (typeof item === "number") {
      return total + item;
    }
    return total; // skip invalid
  }, 0);
}
