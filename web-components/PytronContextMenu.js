import { LitElement, html, css } from 'lit';

export class PytronContextMenu extends LitElement {
  static properties = {
    visible: { type: Boolean },
    x: { type: Number },
    y: { type: Number },
    items: { type: Array },
    variant: { type: String } // 'windows' | 'mac'
  };

  static styles = css`
    :host {
      --menu-bg: var(--pytron-bg-secondary, #252526);
      --menu-fg: var(--pytron-fg, #cccccc);
      --menu-border: var(--pytron-border, #454545);
      --menu-accent: var(--pytron-accent, #0078d4);
      --menu-hover: var(--pytron-hover-bg, #37373d);
      --menu-shadow: 0 10px 25px rgba(0,0,0,0.5);
      
      display: block;
      position: fixed;
      z-index: 10000;
      pointer-events: none;
    }

    .menu-container {
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: 6px;
      padding: 4px;
      min-width: 180px;
      box-shadow: var(--menu-shadow);
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.1s ease, transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
      pointer-events: auto;
      backdrop-filter: blur(10px);
    }

    .menu-container.visible {
      opacity: 1;
      transform: scale(1);
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      color: var(--menu-fg);
      font-size: 13px;
      cursor: default;
      border-radius: 4px;
      transition: background 0.1s;
      position: relative;
    }

    .menu-item:hover {
      background: var(--menu-hover);
      color: #fff;
    }

    .menu-item.divider {
      height: 1px;
      background: var(--menu-border);
      margin: 4px 8px;
      padding: 0;
    }

    .menu-item .label {
      flex: 1;
    }

    .menu-item .shortcut {
      margin-left: 20px;
      font-size: 11px;
      opacity: 0.5;
    }

    .menu-item .icon {
      width: 16px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      opacity: 0.8;
    }

    /* Mac Variant */
    .menu-container.mac {
        background: rgba(40, 40, 40, 0.8);
        border: 0.5px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        backdrop-filter: blur(25px) saturate(180%);
    }

    .menu-container.mac .menu-item {
        border-radius: 5px;
        padding: 4px 10px;
    }

    .menu-container.mac .menu-item:hover {
        background: var(--menu-accent);
    }
  `;

  constructor() {
    super();
    this.visible = false;
    this.x = 0;
    this.y = 0;
    this.variant = 'windows';
    this.items = [];
    this._isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._handleContextMenu = this._handleContextMenu.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._isAndroid) return;
    window.addEventListener('mousedown', this._handleOutsideClick);
    window.addEventListener('contextmenu', this._handleContextMenu);
    window.addEventListener('blur', () => this.hide());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousedown', this._handleOutsideClick);
    window.removeEventListener('contextmenu', this._handleContextMenu);
  }

  _handleContextMenu(e) {
    e.preventDefault();
    this.show(e.clientX, e.clientY);
  }

  _handleOutsideClick(e) {
    if (this.visible && !e.composedPath().includes(this)) {
      this.hide();
    }
  }

  show(x, y) {
    // Basic bounds checking to keep menu on screen
    const menuWidth = 200;
    const menuHeight = this.items.length * 30 + 20;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    this.x = x;
    this.y = y;
    this.visible = true;

    this.requestUpdate();
  }

  hide() {
    this.visible = false;
    this.requestUpdate();
  }

  _handleItemClick(item) {
    if (item.action) {
      item.action();
    }
    this.dispatchEvent(new CustomEvent('item-click', { detail: item }));
    this.hide();
  }

  render() {
    if (this._isAndroid) return html``;
    const defaultItems = [
      { label: 'Back', shortcut: 'Alt+Left', action: () => window.history.back() },
      { label: 'Forward', shortcut: 'Alt+Right', action: () => window.history.forward() },
      { label: 'Reload', shortcut: 'Ctrl+R', action: () => window.location.reload() },
      { type: 'divider' },
      { label: 'Copy', shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
      { label: 'Paste', shortcut: 'Ctrl+V', action: () => document.execCommand('paste') },
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => document.execCommand('selectAll') },
    ];

    const displayItems = this.items.length > 0 ? this.items : defaultItems;

    return html`
      <div 
        class="menu-container ${this.variant} ${this.visible ? 'visible' : ''}"
        style="left: ${this.x}px; top: ${this.y}px; visibility: ${this.visible ? 'visible' : 'hidden'}"
      >
        ${displayItems.map(item => {
      if (item.type === 'divider') {
        return html`<div class="menu-item divider"></div>`;
      }
      return html`
            <div class="menu-item" @click="${() => this._handleItemClick(item)}">
              ${item.icon ? html`<div class="icon">${item.icon}</div>` : ''}
              <div class="label">${item.label}</div>
              ${item.shortcut ? html`<div class="shortcut">${item.shortcut}</div>` : ''}
            </div>
          `;
    })}
      </div>
    `;
  }
}

if (!customElements.get('pytron-context-menu')) {
  customElements.define('pytron-context-menu', PytronContextMenu);
}
