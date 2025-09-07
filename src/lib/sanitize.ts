import DOMPurify, { type Config } from "dompurify";

/** Sanitasi HTML agar aman dirender di React */
export function sanitizeHTML(html: string) {
  const cfg: Config = {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "span",
      "img",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "title", "src", "alt"],
    FORBID_ATTR: ["style", "class", "onload", "onclick", "onerror"],
  };

  const clean = DOMPurify.sanitize(html, cfg) as string;
  return clean.replace(
    /<a\s+/g,
    '<a rel="noopener noreferrer" target="_blank" ',
  );
}
