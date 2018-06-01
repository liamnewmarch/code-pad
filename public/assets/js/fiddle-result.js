import { Fiddle } from "./fiddle.js";

export class FiddleResult extends HTMLElement {

  static get observedAttributes() {
    return ['fiddle'];
  }

  get fiddle() {
    return this.getAttribute('fiddle');
  }

  set fiddle(key) {
    this.setAttribute('fiddle', key);
  }

  attributeChangedCallback(key) {
    if (!this._connected) return;
    const fiddle = Fiddle.load(this.fiddle);
    const { contentWindow, contentDocument } = this.querySelector('iframe');
    // HTML
    contentDocument.body.innerHTML = fiddle.html;
    // CSS
    const style = contentDocument.createElement('style');
    style.innerHTML = fiddle.css || '';
    contentDocument.head.appendChild(style);
    // JavaScript
    try {
      contentWindow.eval(fiddle.javascript || '');
    } catch (error) {
      alert(error);
    }
  }

  connectedCallback() {
    this._connected = true;
  }

  disconnectedCallback() {
    this._connected = false;
  }
}
