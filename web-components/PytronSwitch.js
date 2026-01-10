import { LitElement, html, css } from 'lit';

export class PytronSwitch extends LitElement {
    static properties = {
        checked: { type: Boolean },
        label: { type: String }
    };

    static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .track {
      width: 40px;
      height: 22px;
      background: var(--pytron-border, #454545);
      border-radius: 999px;
      position: relative;
      display: flex;
      align-items: center;
      padding: 2px;
      transition: background-color 0.2s;
    }

    :host([checked]) .track {
      background: var(--pytron-primary, #0078d4);
    }

    .thumb {
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 50%;
      transform: translateX(0px);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Spring-like feeling */
    }

    :host([checked]) .thumb {
      transform: translateX(18px);
    }

    .label {
      font-size: 14px;
      color: var(--pytron-fg, #fff);
      font-family: 'Segoe UI', sans-serif;
    }
  `;

    constructor() {
        super();
        this.checked = false;
        this.label = '';
    }

    _handleClick() {
        this.checked = !this.checked;
        // Dispatch a standard DOM event that bubbles up
        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <div class="track" @click="${this._handleClick}">
        <div class="thumb"></div>
      </div>
      ${this.label ? html`<span class="label" @click="${this._handleClick}">${this.label}</span>` : ''}
    `;
    }
}

if (!customElements.get('pytron-switch')) {
  customElements.define('pytron-switch', PytronSwitch);
}
