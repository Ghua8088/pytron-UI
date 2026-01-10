import { LitElement, html, css } from 'lit';
import { ChevronDown } from 'lucide';

// Basic Chevron SVG for simplicity instead of Lucide dependency inside CSS
const ChevronIcon = html`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
`;

export class PytronSelect extends LitElement {
  static properties = {
    options: { type: Array },
    value: { type: String },
    placeholder: { type: String },
    isOpen: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 150px;
      font-family: 'Segoe UI', sans-serif;
    }

    /* Trigger */
    .trigger {
      padding: 8px 12px;
      background: var(--pytron-secondary, #252526);
      border: 1px solid var(--pytron-border, #454545);
      border-radius: 4px;
      color: var(--pytron-fg, #fff);
      font-size: 14px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: border-color 0.2s;
    }

    .trigger.open {
      border-color: var(--pytron-primary, #0078d4);
    }
    
    .placeholder { color: #aaa; }
    
    /* Dropdown */
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 4px;
      background: var(--pytron-surface, #2b2b2b);
      border: 1px solid var(--pytron-border, #454545);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    }

    .option {
      padding: 8px 12px;
      font-size: 14px;
      color: var(--pytron-fg, #fff);
      cursor: pointer;
    }

    .option:hover {
      background: var(--pytron-secondary, #333);
    }

    .option.selected {
      background: var(--pytron-primary, #0078d4);
    }

    .no-options {
      padding: 8px 12px;
      font-size: 13px;
      color: #aaa;
    }
  `;

  constructor() {
    super();
    this.options = [];
    this.value = '';
    this.placeholder = 'Select...';
    this.isOpen = false;
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('mousedown', this._handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('mousedown', this._handleOutsideClick);
  }

  _handleOutsideClick(e) {
    if (this.isOpen && !this.contains(e.target)) {
      this.isOpen = false;
    }
  }

  async _toggle() {
    if (!this.isOpen) {
      // Calculate Position before opening
      const rect = this.shadowRoot.querySelector('.trigger').getBoundingClientRect();
      this.dropdownStyle = `
                top: ${rect.bottom + window.scrollY}px;
                left: ${rect.left + window.scrollX}px;
                width: ${rect.width}px;
                position: fixed; /* Escape overflow containment */
            `;
    }
    this.isOpen = !this.isOpen;
  }

  _select(value) {
    this.value = value;
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const selectedOption = this.options.find(o => o.value === this.value);

    return html`
      <div 
        class="trigger ${this.isOpen ? 'open' : ''}" 
        @click="${this._toggle}"
      >
        <span class="${!selectedOption ? 'placeholder' : ''}">
          ${selectedOption ? selectedOption.label : this.placeholder}
        </span>
        ${ChevronIcon}
      </div>

      ${this.isOpen ? html`
        <div class="dropdown" style="${this.dropdownStyle || ''}">
          ${this.options.length > 0 ? this.options.map(opt => html`
            <div 
              class="option ${opt.value === this.value ? 'selected' : ''}"
              @click="${() => this._select(opt.value)}"
            >
              ${opt.label}
            </div>
          `) : html`<div class="no-options">No options</div>`}
        </div>
      ` : ''}
    `;
  }
}

if (!customElements.get('pytron-select')) {
  customElements.define('pytron-select', PytronSelect);
}
