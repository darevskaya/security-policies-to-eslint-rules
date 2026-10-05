const source = "1 + 1";

console.log(eval(source));

const add = new Function("a", "b", "return a + b");
console.log(add(1, 1));

setTimeout("console.log('tick')", 1000);
