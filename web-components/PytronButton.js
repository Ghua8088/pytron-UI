import { LitElement, html, css } from 'lit';

export class PytronButton extends LitElement {
  static properties = {
    variant: { type: String },
    disabled: { type: Boolean }
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: 'Segoe UI', sans-serif;
      transition: background-color 0.2s;
      width: 100%;
      height: 100%;
    }

    /* Primary */
    button.primary {
      background-color: var(--pytron-primary, #0078d4);
      color: var(--pytron-primary-fg, #fff);
    }

    /* Secondary */
    button.secondary {
      background-color: var(--pytron-secondary, #444);
      color: var(--pytron-fg, #fff);
    }

    /* Danger */
    button.danger {
      background-color: var(--pytron-danger, #e81123);
      color: #fff;
    }

    /* Ghost */
    button.ghost {
      background-color: transparent;
      color: var(--pytron-fg, #fff);
      box-shadow: none;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.disabled = false;
  }

  render() {
    return html`
      <button 
        class="${this.variant}" 
        ?disabled="${this.disabled}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }

  _handleClick(e) {
    if (this.disabled) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
}

customElements.define('pytron-button', PytronButton);
