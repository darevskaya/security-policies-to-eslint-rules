fetch("https://analytics.other.example/event");

navigator.sendBeacon("https://logs.other.example", "page-view");

const socket = new WebSocket("wss://socket.other.example");
socket.addEventListener("message", (event) => console.log(event.data));
