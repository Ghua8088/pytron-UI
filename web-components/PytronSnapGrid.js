import { LitElement, html, css } from 'lit';
import pytron from 'pytron-client';

export class PytronSnapGrid extends LitElement {
    static styles = css`
    :host {
      display: block;
      position: absolute;
      top: 38px;
      right: 0;
      z-index: 9999;
    }

    .grid-container {
      width: 240px;
      background: var(--pytron-bg, #202020);
      border: 1px solid var(--pytron-border, #333);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      backdrop-filter: blur(10px);
    }

    .row {
      display: flex;
      gap: 6px;
      height: 50px;
      width: 100%;
    }

    .snap-item {
      background: var(--pytron-secondary, #3a3a3a);
      border: 1px solid var(--pytron-border, #555);
      cursor: pointer;
      transition: background 0.1s;
    }

    .snap-item:hover {
      background: var(--pytron-primary, #0078d4);
      border-color: var(--pytron-primary, #0078d4);
    }

    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }
    
    .row-quarters {
      flex-wrap: wrap;
      height: 100px;
    }

    .quarter-item {
      width: calc(50% - 3px); 
      height: calc(50% - 3px);
    }

    .radius-left { borderRadius: 4px 0 0 4px; border-right: none; }
    .radius-right { borderRadius: 0 4px 4px 0; }
    
    .radius-tl { borderRadius: 4px 0 0 0; }
    .radius-tr { borderRadius: 0 4px 0 0; }
    .radius-bl { borderRadius: 0 0 0 4px; }
    .radius-br { borderRadius: 0 0 4px 0; }
  `;

    _snap(type) {
        const scale = window.devicePixelRatio || 1;
        const screenLeft = window.screen.availLeft || 0;
        const screenTop = window.screen.availTop || 0;
        const screenW = window.screen.availWidth;
        const screenH = window.screen.availHeight;

        let x, y, w, h;

        switch (type) {
            // --- ROW 1: Halves (50/50) ---
            case 'left-half':
                x = screenLeft; y = screenTop; w = screenW / 2; h = screenH;
                break;
            case 'right-half':
                x = screenLeft + (screenW / 2); y = screenTop; w = screenW / 2; h = screenH;
                break;

            // --- ROW 2: Thirds (66/33) ---
            case 'two-thirds-left':
                x = screenLeft; y = screenTop; w = (screenW / 3) * 2; h = screenH;
                break;
            case 'one-third-right':
                x = screenLeft + ((screenW / 3) * 2); y = screenTop; w = screenW / 3; h = screenH;
                break;

            // --- ROW 3: Quarters (Corner Snaps) ---
            case 'top-left':
                x = screenLeft; y = screenTop; w = screenW / 2; h = screenH / 2;
                break;
            case 'top-right':
                x = screenLeft + (screenW / 2); y = screenTop; w = screenW / 2; h = screenH / 2;
                break;
            case 'bottom-left':
                x = screenLeft; y = screenTop + (screenH / 2); w = screenW / 2; h = screenH / 2;
                break;
            case 'bottom-right':
                x = screenLeft + (screenW / 2); y = screenTop + (screenH / 2); w = screenW / 2; h = screenH / 2;
                break;
            default: return;
        }

        // Convert to physical pixels for backend
        const finalX = Math.round(x * scale);
        const finalY = Math.round(y * scale);
        const finalW = Math.round(w * scale);
        const finalH = Math.round(h * scale);

        this._sendToBackend(finalX, finalY, finalW, finalH);
        this._close();
    }

    async _sendToBackend(x, y, w, h) {
        try {
            if (pytron && pytron.set_bounds) {
                await pytron.set_bounds(x, y, w, h);
            } else if (window.pytron_set_bounds) {
                await window.pytron_set_bounds(x, y, w, h);
            } else {
                console.warn('[PytronSnapGrid] Backend not connected');
            }
        } catch (err) {
            console.error('Snap error:', err);
        }
    }

    _close() {
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }

    render() {
        return html`
      <div class="grid-container" @mouseleave="${this._close}">
        
        <!-- Row 1: 50/50 -->
        <div class="row">
          <div class="snap-item flex-1 radius-left" @click="${() => this._snap('left-half')}"></div>
          <div class="snap-item flex-1 radius-right" @click="${() => this._snap('right-half')}"></div>
        </div>

        <!-- Row 2: 66/33 -->
        <div class="row">
          <div class="snap-item flex-2 radius-left" @click="${() => this._snap('two-thirds-left')}"></div>
          <div class="snap-item flex-1 radius-right" @click="${() => this._snap('one-third-right')}"></div>
        </div>

        <!-- Row 3: Quarters -->
        <div class="row row-quarters">
          <div class="snap-item quarter-item radius-tl" @click="${() => this._snap('top-left')}"></div>
          <div class="snap-item quarter-item radius-tr" @click="${() => this._snap('top-right')}"></div>
          <div class="snap-item quarter-item radius-bl" @click="${() => this._snap('bottom-left')}"></div>
          <div class="snap-item quarter-item radius-br" @click="${() => this._snap('bottom-right')}"></div>
        </div>

      </div>
    `;
    }
}

customElements.define('pytron-snap-grid', PytronSnapGrid);
