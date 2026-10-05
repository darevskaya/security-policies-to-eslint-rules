const source = "1 + 1";

eval(source);

const add = new Function("a", "b", "return a + b");

setTimeout("console.log('tick')", 1000);
