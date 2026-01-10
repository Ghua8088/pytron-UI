import { LitElement, html, css } from 'lit';

const CloseIcon = html`
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
`;

// Note: Modals in Web Components usually don't use React Portals.
// Instead, they are just fixed elements. The user just puts <pytron-modal> anywhere and it covers the screen.

export class PytronModal extends LitElement {
    static properties = {
        isOpen: { type: Boolean, attribute: 'is-open' },
        title: { type: String },
        width: { type: String }
    };

    static styles = css`
    :host {
      font-family: 'Segoe UI', sans-serif;
      z-index: 9999;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      pointer-events: none; /* Let clicks pass through when hidden */
      transition: opacity 0.2s;
    }

    /* Show state */
    :host([is-open]) .overlay {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-card {
      background: var(--pytron-bg, #1e1e1e);
      border: 1px solid var(--pytron-border, #333);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      border-radius: 8px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      transform: translateY(20px) scale(0.95);
      transition: transform 0.2s;
    }

    :host([is-open]) .modal-card {
      transform: translateY(0) scale(1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--pytron-border, #333);
    }

    .title {
      font-weight: 600;
      font-size: 18px;
      color: var(--pytron-fg, #fff);
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--pytron-fg, #aaa);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
    }

    .close-btn:hover {
      color: #fff;
      background: #333;
    }

    .content {
      padding: 20px;
      overflow-y: auto;
      color: var(--pytron-fg, #ccc);
      line-height: 1.5;
    }

    .footer {
      padding: 16px 20px;
      border-top: 1px solid var(--pytron-border, #333);
      background: var(--pytron-secondary, #252526);
      border-radius: 0 0 8px 8px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `;

    constructor() {
        super();
        this.isOpen = false;
        this.title = '';
        this.width = '500px';
    }

    _close() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }

    render() {
        return html`
      <div class="overlay">
        <div class="modal-card" style="width: ${this.width}">
          
          <div class="header">
            <div class="title">${this.title}</div>
            <button class="close-btn" @click="${this._close}">
              ${CloseIcon}
            </button>
          </div>

          <div class="content">
            <slot></slot>
          </div>

          <div class="footer">
             <slot name="footer"></slot>
          </div>

        </div>
      </div>
    `;
    }
}

if (!customElements.get('pytron-modal')) {
  customElements.define('pytron-modal', PytronModal);
}
