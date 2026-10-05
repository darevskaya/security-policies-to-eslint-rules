new Worker("data:text/javascript,postMessage('ready')");

new SharedWorker("https://other.example/worker.js");

navigator.serviceWorker.register("https://other.example/sw.js");
