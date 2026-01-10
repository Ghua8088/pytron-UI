import { LitElement, html, css } from 'lit';
import pytron from 'pytron-client';

export class PytronResizeHandles extends LitElement {
  static styles = css`
    :host {
      display: block;
      pointer-events: none; /* Let clicks pass unless on handles */
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
    }

    .handle {
      position: absolute;
      pointer-events: auto;
      background: transparent; /* Invisible grab area */
    }

    .right {
      top: 0; right: 0; width: 4px; height: 100%; cursor: ew-resize;
    }

    .bottom {
      bottom: 0; left: 0; width: 100%; height: 4px; cursor: ns-resize;
    }

    .corner {
      bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize; z-index: 10000;
    }
  `;

  constructor() {
    super();
    this.isResizing = false;
    this.startPos = { x: 0, y: 0 };
    this.startSize = { width: 0, height: 0 };
    this.direction = '';
    this._isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

    // Bind methods
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('mousemove', this._handleMouseMove);
    document.addEventListener('mouseup', this._handleMouseUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
  }

  async _startResize(e, dir) {
    e.preventDefault();
    this.isResizing = true;
    this.direction = dir;
    this.startPos = { x: e.screenX, y: e.screenY };

    if (pytron && pytron.get_size) {
      this.startSize = await pytron.get_size();
    } else {
      this.startSize = { width: window.outerWidth, height: window.outerHeight };
    }

    document.body.style.cursor = dir === 'se' ? 'nwse-resize' : (dir === 'e' ? 'ew-resize' : 'ns-resize');
  }

  async _handleMouseMove(e) {
    if (!this.isResizing) return;

    const dx = e.screenX - this.startPos.x;
    const dy = e.screenY - this.startPos.y;

    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;

    if (this.direction.includes('e')) newWidth += dx;
    if (this.direction.includes('s')) newHeight += dy;

    if (newWidth < 200) newWidth = 200;
    if (newHeight < 100) newHeight = 100;

    if (pytron && pytron.resize) {
      await pytron.resize(Math.round(newWidth), Math.round(newHeight));
    }
  }

  _handleMouseUp() {
    this.isResizing = false;
    document.body.style.cursor = 'default';
  }

  render() {
    if (this._isAndroid) return html``;
    return html`
      <div class="handle right" @mousedown="${(e) => this._startResize(e, 'e')}"></div>
      <div class="handle bottom" @mousedown="${(e) => this._startResize(e, 's')}"></div>
      <div class="handle corner" @mousedown="${(e) => this._startResize(e, 'se')}"></div>
    `;
  }
}

if (!customElements.get('pytron-resize-handles')) {
  customElements.define('pytron-resize-handles', PytronResizeHandles);
}
