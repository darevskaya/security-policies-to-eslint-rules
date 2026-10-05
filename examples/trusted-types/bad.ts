const value = new URLSearchParams(location.search).get("comment") ?? "";
const output = document.createElement("div");

output.innerHTML = "<b>Hello</b>";

output.innerHTML = value;
