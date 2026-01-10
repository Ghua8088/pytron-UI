import { LitElement, html, css } from 'lit';
import pytron from 'pytron-client';
import './PytronSnapGrid.js'; // Ensure SnapGrid is registered

export class PytronTitleBar extends LitElement {
  static properties = {
    title: { type: String },
    variant: { type: String }, // 'windows' | 'mac'
    icon: { type: String },
    isMaximized: { type: Boolean, state: true },
    showSnapMenu: { type: Boolean, state: true },
    _isAndroid: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: fixed; /* Changed from sticky to fixed */
      top: 0;
      left: 0;
      z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
    }

    .pytron-titlebar {
      height: 38px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--pytron-titlebar-bg, var(--pytron-bg, #1e1e1e));
      color: var(--pytron-fg, #fff);
      user-select: none;
      box-sizing: border-box;
      border-bottom: 1px solid var(--pytron-border, #333);
    }
    
    .pytron-titlebar.mac {
      flex-direction: row-reverse;
      justify-content: space-between;
    }

    /* 1. Drag Region */
    .drag-region {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 12px;
      -webkit-app-region: drag; /* Electron/standard webview drag region */
    }

    /* 2. Window Controls */
    .window-controls {
      display: flex;
      height: 100%;
      -webkit-app-region: no-drag;
    }

    .control-btn {
      width: 46px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
      transition: background-color 0.1s;
    }
    
    .control-btn:hover {
      background-color: var(--pytron-hover-bg, #3a3a3a);
    }

    .control-btn.close:hover {
      background-color: #e81123;
      color: white;
    }

    .icon {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }

    /* Mac Controls */
    .window-controls.mac {
        padding-left: 10px;
        gap: 8px;
        align-items: center;
    }
    
    .mac-btn {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    
    .mac-btn.close { background: #ff5f56; }
    .mac-btn.minimize { background: #ffbd2e; }
    .mac-btn.maximize { background: #27c93f; }
    
    .mac-btn .icon { opacity: 0; transition: opacity 0.1s; width: 8px; height: 8px; fill: rgba(0,0,0,0.5); }
    .window-controls.mac:hover .mac-btn .icon { opacity: 1; }
  `;

  constructor() {
    super();
    this.title = "Pytron App";
    this.variant = "windows";
    this.icon = "🐍";
    this.isMaximized = false;
    this.showSnapMenu = false;
    this._hoverTimeout = null;
    this._isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
  }

  // --- ACTIONS ---

  async _handleDrag(e) {
    if (e.button !== 0) return; // Only left click

    try {
      if (pytron && typeof pytron.waitForBackend === 'function') {
        try { await pytron.waitForBackend(2000); } catch (e) { /* ignore */ }
      }
      if (pytron && pytron.drag) {
        await pytron.drag();
      } else if (window.pytron_drag) {
        await window.pytron_drag();
      }
    } catch (err) {
      console.warn('[Pytron] Drag failed:', err);
    }
  }

  async _minimize() {
    this.dispatchEvent(new CustomEvent('minimize', { bubbles: true, composed: true }));
    try {
      if (pytron?.minimize) await pytron.minimize();
      else if (window.pytron_minimize) await window.pytron_minimize();
    } catch (err) { console.warn('Minimize failed:', err); }
  }

  async _toggleMaximize() {
    this.dispatchEvent(new CustomEvent('maximize', { bubbles: true, composed: true }));
    try {
      if (pytron?.toggle_maximize) await pytron.toggle_maximize();
      else if (window.pytron_toggle_maximize) await window.pytron_toggle_maximize();
    } catch (err) { console.warn('Maximize failed:', err); }
    this.isMaximized = !this.isMaximized;
  }

  async _closeApp() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    try {
      if (pytron?.close) await pytron.close();
      else if (window.pytron_close) await window.pytron_close();
    } catch (err) { console.warn('Close failed:', err); }
  }

  // --- HOVER LOGIC FOR SNAP MENU ---
  _handleMouseEnterMax() {
    if (this.variant === 'mac') return;
    this._hoverTimeout = setTimeout(() => {
      this.showSnapMenu = true;
    }, 500);
  }

  _handleMouseLeaveMax() {
    clearTimeout(this._hoverTimeout);
  }

  render() {
    if (this._isAndroid) return html``;
    return html`
      <div class="pytron-titlebar ${this.variant}">
        
        <!-- MAC TRAFFIC LIGHTS (If Variant is Mac) -->
        ${this.variant === 'mac' ? this._renderMacControls() : ''}

        <!-- DRAG AREA -->
        <div class="drag-region" @mousedown="${this._handleDrag}">
          ${this.variant !== 'mac' ? html`<span style="margin-right: 8px">${this.icon}</span>` : ''}
          <span style="font-weight: ${this.variant === 'mac' ? '600' : '400'}">${this.title}</span>
          <slot></slot> <!-- For children/searchbars -->
        </div>

        <!-- WINDOWS CONTROLS (If Variant is Windows) -->
        ${this.variant === 'windows' ? this._renderWindowsControls() : ''}
        
         <!-- SNAP GRID -->
        ${this.showSnapMenu && this.variant === 'windows'
        ? html`<pytron-snap-grid @close="${() => this.showSnapMenu = false}"></pytron-snap-grid>`
        : ''}
      </div>
    `;
  }

  _renderWindowsControls() {
    return html`
      <div class="window-controls" @mousedown="${(e) => e.stopPropagation()}">
        <div class="control-btn" @click="${this._minimize}" title="Minimize">
          <svg class="icon" viewBox="0 0 10 1"><path d="M0 0h10v1H0z" /></svg>
        </div>

        <div class="control-btn" 
             @click="${this._toggleMaximize}"
             @mouseenter="${this._handleMouseEnterMax}"
             @mouseleave="${this._handleMouseLeaveMax}"
             title="Maximize"
             style="position: relative;">
          <svg class="icon" viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
        </div>

        <div class="control-btn close" @click="${this._closeApp}" title="Close">
            <svg class="icon" viewBox="0 0 10 10"><path d="M10.7 0.7L10 0 5.3 4.7 0.7 0 0 0.7 4.7 5.3 0 10 0.7 10.7 5.3 6 10 10.7 10.7 10 6 5.3z" transform="scale(0.9)"/></svg>
        </div>
      </div>
    `;
  }

  _renderMacControls() {
    return html`
        <div class="window-controls mac" @mousedown="${(e) => e.stopPropagation()}">
            <div class="mac-btn close" @click="${this._closeApp}"><svg class="icon"><path d="M..."/></svg></div>
            <div class="mac-btn minimize" @click="${this._minimize}"><svg class="icon"><path d="M..."/></svg></div>
            <div class="mac-btn maximize" @click="${this._toggleMaximize}"><svg class="icon"><path d="M..."/></svg></div>
        </div>
      `;
  }
}

if (!customElements.get('pytron-titlebar')) {
  customElements.define('pytron-titlebar', PytronTitleBar);
}
