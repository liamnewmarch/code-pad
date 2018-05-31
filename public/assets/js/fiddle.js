export const defaults = {
  name: 'Untitled',
  html: '<p> Hello, world! </p>\n',
  css: 'html {\n  background-color: #272822;\n  color: #fff;\n}\n',
  javascript: 'const p = document.querySelector(\'p\');\n',
};

export function Fiddle() {
  return function(data) {
    return Object.assign({
      key: Math.floor(new Date() / 1000).toString(36)
    }, defaults, data);
  };
}
