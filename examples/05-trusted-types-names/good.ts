trustedTypes.createPolicy("app-html", {
  createHTML: (html) => html.replaceAll("<", "&lt;"),
});
