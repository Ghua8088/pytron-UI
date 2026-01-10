import { LitElement, html, css } from 'lit';

export class PytronInput extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    placeholder: { type: String },
    type: { type: String },
    error: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: 'Segoe UI', sans-serif;
    }

    label {
      font-size: 13px;
      font-weight: 500;
      color: var(--pytron-fg, #fff);
    }

    input {
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid var(--pytron-border, #454545);
      background: var(--pytron-secondary, #252526);
      color: var(--pytron-fg, #fff);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
      box-sizing: border-box;
      z-index:999;
    }

    input:focus {
      border-color: var(--pytron-primary, #0078d4);
    }

    :host([error]) input {
      border-color: var(--pytron-danger, #e81123);
    }

    .error-msg {
      font-size: 12px;
      color: var(--pytron-danger, #e81123);
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.type = 'text';
    this.error = '';
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleChange(e) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      ${this.label ? html`<label>${this.label}</label>` : ''}
      <input 
        .type="${this.type}" 
        .value="${this.value}" 
        .placeholder="${this.placeholder}"
        @input="${this._handleInput}"
        @change="${this._handleChange}"
      />
      ${this.error ? html`<span class="error-msg">${this.error}</span>` : ''}
    `;
  }
}

if (!customElements.get('pytron-input')) {
  customElements.define('pytron-input', PytronInput);
}
