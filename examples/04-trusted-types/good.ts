const comment = new URLSearchParams(location.search).get("comment") ?? "";
const output = document.createElement("div");

const policy = trustedTypes.createPolicy("app-html", {
  createHTML: (html) => html.replaceAll("<", "&lt;"),
});

output.innerHTML = policy.createHTML(comment) as unknown as string;
