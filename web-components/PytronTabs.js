import { LitElement, html, css } from 'lit';

export class PytronTabs extends LitElement {
    static properties = {
        // tabs = JSON string like '[{"id":"a", "label":"Msg"}, ...]' or Array
        tabs: { type: Array },
        activeTab: { type: String, attribute: 'active-tab' }
    };

    static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', sans-serif;
    }

    .tabs-track {
      display: flex;
      border-bottom: 1px solid var(--pytron-border, #333);
      gap: 2px;
    }

    .tab-item {
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      color: var(--pytron-fg, #ccc);
      background: transparent;
      border-top: 2px solid transparent;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .tab-item:hover {
      background: rgba(255,255,255,0.05);
    }

    .tab-item.active {
      color: var(--pytron-primary-fg, #fff);
      background: var(--pytron-secondary, #2d2d2d);
      border-bottom: 2px solid var(--pytron-primary, #0078d4);
    }
  `;

    constructor() {
        super();
        this.tabs = [];
        this.activeTab = '';
    }

    _handleClick(tabId) {
        this.activeTab = tabId;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { activeTab: tabId },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (!this.tabs || !Array.isArray(this.tabs)) return html``;

        return html`
      <div class="tabs-track">
        ${this.tabs.map(tab => html`
          <div 
            class="tab-item ${this.activeTab === tab.id ? 'active' : ''}" 
            @click="${() => this._handleClick(tab.id)}"
          >
            ${tab.label}
          </div>
        `)}
      </div>
    `;
    }
}

if (!customElements.get('pytron-tabs')) {
  customElements.define('pytron-tabs', PytronTabs);
}
