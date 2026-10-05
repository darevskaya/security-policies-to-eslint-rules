const comment = new URLSearchParams(location.search).get("comment") ?? "";
const output = document.createElement("div");

output.innerHTML = comment;
output.insertAdjacentHTML("beforeend", comment);
