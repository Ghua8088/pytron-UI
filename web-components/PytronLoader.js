import { LitElement, html, css } from 'lit';

export class PytronLoader extends LitElement {
    static properties = {
        size: { type: Number },
        color: { type: String }
    };

    static styles = css`
    :host {
      display: inline-block;
    }

    .spinner {
      border-radius: 50%;
      border: 3px solid var(--pytron-secondary, rgba(255,255,255,0.1));
      border-top-color: var(--spinner-color, #0078d4);
      animation: pytron-spin 0.8s linear infinite;
      box-sizing: border-box;
    }

    @keyframes pytron-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    constructor() {
        super();
        this.size = 24;
        this.color = '';
    }

    render() {
        // We dynamically set the CSS variable for color if provided
        const style = `
      width: ${this.size}px;
      height: ${this.size}px;
      --spinner-color: ${this.color || 'var(--pytron-primary, #0078d4)'};
    `;
        return html`<div class="spinner" style="${style}"></div>`;
    }
}

customElements.define('pytron-loader', PytronLoader);
