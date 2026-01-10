import { LitElement, html, css } from 'lit';

// Sidebar Container
export class PytronSidebar extends LitElement {
    static properties = {
        width: { type: String }
    };

    static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar {
      height: 100%;
      background: var(--pytron-bg, #1e1e1e);
      border-right: 1px solid var(--pytron-border, #333);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      font-family: 'Segoe UI', sans-serif;
    }
  `;

    constructor() {
        super();
        this.width = '250px';
    }

    render() {
        return html`
      <div class="sidebar" style="width: ${this.width}">
        <slot></slot>
      </div>
    `;
    }
}

// Sidebar Item
export class PytronSidebarItem extends LitElement {
    static properties = {
        label: { type: String },
        active: { type: Boolean },
        badge: { type: String },
        icon: { type: String } // Accepts SVG string or URL, but primarily we expect user to slot an icon or use text
    };

    static styles = css`
    :host {
      display: block;
      user-select: none;
      font-family: 'Segoe UI', sans-serif;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 14px;
      color: var(--pytron-fg-dim, #aaa);
      background: transparent;
      border-left: 3px solid transparent;
      transition: background 0.2s;
    }

    .item:hover {
      background: rgba(255,255,255,0.03);
    }

    .item.active {
      color: var(--pytron-fg, #fff);
      background: var(--pytron-secondary, #333);
      border-left: 3px solid var(--pytron-primary, #0078d4);
    }

    .label {
      flex: 1;
    }

    .badge {
      background: var(--pytron-primary, #0078d4);
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 99px;
      font-weight: 600;
    }

    /* Helper for slotted icons to behave */
    ::slotted(svg) {
      width: 18px;
      height: 18px;
    }
  `;

    constructor() {
        super();
        this.label = '';
        this.active = false;
        this.badge = '';
    }

    render() {
        return html`
      <div class="item ${this.active ? 'active' : ''}">
        <slot name="icon"></slot>
        <span class="label">${this.label}</span>
        ${this.badge ? html`<span class="badge">${this.badge}</span>` : ''}
      </div>
    `;
    }
}

// Sidebar Header
export class PytronSidebarHeader extends LitElement {
    static styles = css`
    :host {
      display: block;
      padding: 20px 16px;
      font-weight: 600;
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-family: 'Segoe UI', sans-serif;
    }
  `;
    render() {
        return html`<slot></slot>`;
    }
}

if (!customElements.get('pytron-sidebar')) {
  customElements.define('pytron-sidebar', PytronSidebar);
}
if (!customElements.get('pytron-sidebar-item')) {
  customElements.define('pytron-sidebar-item', PytronSidebarItem);
}
if (!customElements.get('pytron-sidebar-header')) {
  customElements.define('pytron-sidebar-header', PytronSidebarHeader);
}
