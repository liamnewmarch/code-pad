import { deleteItem, getItem, setItem } from './store.js';

export const defaults = {
  name: 'Untitled',
  html: '<p> Hello, world! </p>\n',
  css: 'html {\n  background-color: #272822;\n  color: #fff;\n}\n',
  javascript: 'const p = document.querySelector(\'p\');\n',
};

export class Fiddle {

  static create() {
    const fiddle = new Fiddle();
    const fiddles = getItem('fiddles', []);
    if (!fiddles.includes(fiddle.key)) {
      setItem('fiddles', [...fiddles, fiddle.key]);
    }
    return fiddle.save();
  }

  static load(key) {
    const data = getItem(key, {});
    if (!data) return;
    return new Fiddle(data);
  }

  constructor(data = {}) {
    this.key = Math.floor(new Date() / 1000).toString(36);
    Object.assign(this, defaults, data);
  }

  copy() {
    const textarea = document.createElement('textarea');
    textarea.value = JSON.stringify(this);
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  delete() {
    deleteItem(this.key);
    const fiddles = getItem('fiddles', []).filter(key => key !== this.key);
    setItem('fiddles', fiddles);
    return this.key;
  }

  save() {
    setItem(this.key, this);
    return this;
  }
}
