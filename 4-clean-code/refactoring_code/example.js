// code refactoring example

function getTotal(items) {
  return items.reduce((total, item) => {
    if (typeof item === "number") {
      return total + item;
    }
    if (item && typeof item === "object" && "price" in item && "qty" in item) {
      return total + item.price * item.qty;
    }
    return total;
  }, 0);
}


