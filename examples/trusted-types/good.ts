const comment = new URLSearchParams(location.search).get("comment") ?? "";
const output = document.createElement("div");

const policy = trustedTypes.createPolicy("app-html", {
  createHTML: (html) => sanitize(html),
});

output.innerHTML = policy.createHTML(comment) as unknown as string;
