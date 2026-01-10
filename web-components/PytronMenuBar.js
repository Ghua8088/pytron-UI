import { LitElement, html, css } from 'lit';

export class PytronMenuBar extends LitElement {
  static properties = {
    // Menus: [{ label, items: [{label, onClick, ...}] }]
    // Since functions (onClick) can't travel through JSON attributes easily,
    // this component is best used by setting the .menus property directly via JS.
    menus: { type: Array },
    activeMenu: { type: Number, state: true }
  };

  static styles = css`
    :host {
      display: block;
      user-select: none;
      font-family: 'Segoe UI', sans-serif;
      /* Inherited from parent usually, but defaults here */
      color: var(--pytron-fg, #fff);
      font-size: 13px;
      /* IMPORTANT: Allow dropdowns to overflow */
      overflow: visible; 
      z-index: 99999;
    }

    .bar {
      display: flex;
      background: transparent; /* Changed from variable to transparent to blend with titlebar */
      -webkit-app-region: no-drag;
    }

    .menu-wrapper {
      position: relative; /* Anchor for absolute dropdown */
    }

    .menu-trigger {
      padding: 6px 10px;
      cursor: default;
      position: relative;
    }

    .menu-trigger:hover {
      /* Only hover effect if not active, or handle via JS state */
    }
    
    .menu-trigger.active {
      background: var(--pytron-secondary, #505050);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--pytron-surface, #2b2b2b);
      border: 1px solid var(--pytron-border, #454545);
      min-width: 200px;
      z-index: 2000;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4);
      padding: 4px 0;
    }

    .menu-item {
      padding: 8px 16px;
      cursor: default;
      display: flex;
      justify-content: space-between;
    }

    .menu-item:hover {
      background: var(--pytron-primary, #0078d4);
      color: var(--pytron-primary-fg, #fff);
    }

    .shortcut {
      color: var(--pytron-fg-dim, #aaa);
      font-size: 11px;
      margin-left: 10px;
    }
    
    .menu-item:hover .shortcut {
      color: var(--pytron-primary-fg, #fff);
    }

    .separator {
      height: 1px;
      background: var(--pytron-border, #454545);
      margin: 4px 0;
    }
  `;

  constructor() {
    super();
    this.menus = [];
    this.activeMenu = null;
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
    if (this.activeMenu !== null && !this.contains(e.target)) {
      this.activeMenu = null;
    }
  }

  _toggleMenu(index) {
    if (this.activeMenu === index) {
      this.activeMenu = null;
    } else {
      this.activeMenu = index;
    }
  }

  _hoverMenu(index) {
    if (this.activeMenu !== null) {
      this.activeMenu = index;
    }
  }

  _handleItemClick(item) {
    if (item.onClick) item.onClick();
    // Dispatch event for pure HTML usage
    this.dispatchEvent(new CustomEvent('item-click', { detail: { item } }));
    this.activeMenu = null;
  }

  render() {
    return html`
      <div class="bar" @mousedown="${(e) => e.stopPropagation()}">
        ${this.menus.map((menu, index) => html`
          <div class="menu-wrapper">
             <div 
               class="menu-trigger ${this.activeMenu === index ? 'active' : ''}"
               @click="${() => this._toggleMenu(index)}"
               @mouseenter="${() => this._hoverMenu(index)}"
             >
               ${menu.label}
             </div>
             
             ${this.activeMenu === index ? html`
               <div class="dropdown">
                 ${menu.items.map(item => {
      if (item.separator) return html`<div class="separator"></div>`;
      return html`
                        <div class="menu-item" @click="${() => this._handleItemClick(item)}">
                            <span>${item.label}</span>
                            ${item.shortcut ? html`<span class="shortcut">${item.shortcut}</span>` : ''}
                        </div>
                    `;
    })}
               </div>
             ` : ''}
          </div>
        `)}
      </div>
    `;
  }
}

if (!customElements.get('pytron-menubar')) {
  customElements.define('pytron-menubar', PytronMenuBar);
}
