import { LitElement, html, css } from 'lit';

export class PytronDialog extends LitElement {
    static properties = {
        isOpen: { type: Boolean, attribute: 'is-open' },
        title: { type: String },
        message: { type: String },
        confirmText: { type: String, attribute: 'confirm-text' },
        cancelText: { type: String, attribute: 'cancel-text' }
    };

    static styles = css`
    :host {
      font-family: 'Segoe UI', sans-serif;
      z-index: 10000; /* Higher than modal usually */
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    :host([is-open]) .overlay {
      opacity: 1;
      pointer-events: auto;
    }

    .dialog-card {
      background: var(--pytron-surface, #2b2b2b);
      color: var(--pytron-fg, #fff);
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 80%;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      border: 1px solid var(--pytron-border, #333);
      transform: scale(0.9);
      transition: transform 0.2s;
    }

    :host([is-open]) .dialog-card {
      transform: scale(1);
    }

    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 18px;
    }

    .message {
      margin-bottom: 20px;
      line-height: 1.5;
      font-size: 14px;
    }

    .btn-row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: var(--pytron-secondary, #444);
      color: var(--pytron-fg, #fff);
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    
    button.confirm {
      background: var(--pytron-primary, #0078d4);
      color: var(--pytron-primary-fg, #fff);
    }
  `;

    constructor() {
        super();
        this.isOpen = false;
        this.title = '';
        this.message = '';
        this.confirmText = 'OK';
        this.cancelText = 'Cancel';
    }

    _confirm() {
        this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
    }

    _cancel() {
        this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
    }

    render() {
        return html`
      <div class="overlay">
        <div class="dialog-card">
          ${this.title ? html`<h3>${this.title}</h3>` : ''}
          <div class="message">${this.message}</div>
          
          <div class="btn-row">
            <button @click="${this._cancel}">${this.cancelText}</button>
            <button class="confirm" @click="${this._confirm}">${this.confirmText}</button>
          </div>
        </div>
      </div>
    `;
    }
}

customElements.define('pytron-dialog', PytronDialog);
