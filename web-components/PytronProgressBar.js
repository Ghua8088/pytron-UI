import { LitElement, html, css } from 'lit';

export class PytronProgressBar extends LitElement {
    static properties = {
        value: { type: Number },
        max: { type: Number },
        color: { type: String },
        height: { type: String },
        showLabel: { type: Boolean, attribute: 'show-label' }
    };

    static styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: 'Segoe UI', sans-serif;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 12px;
      color: var(--pytron-fg, #ccc);
    }

    .track {
      width: 100%;
      background: var(--pytron-secondary, #333);
      border-radius: 999px;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      background: var(--progress-color, #0078d4);
      border-radius: 999px;
      transition: width 0.3s ease-out;
    }
  `;

    constructor() {
        super();
        this.value = 0;
        this.max = 100;
        this.color = '';
        this.height = '4px';
        this.showLabel = false;
    }

    render() {
        const percentage = Math.min(100, Math.max(0, (this.value / this.max) * 100));

        // Dynamic styles for height and color
        const trackStyle = `height: ${this.height};`;
        const fillStyle = `
       width: ${percentage}%; 
       --progress-color: ${this.color || 'var(--pytron-primary, #0078d4)'};
    `;

        return html`
      ${this.showLabel ? html`
        <div class="label-row">
            <span>Progress</span>
            <span>${Math.round(percentage)}%</span>
        </div>
      ` : ''}
      
      <div class="track" style="${trackStyle}">
        <div class="fill" style="${fillStyle}"></div>
      </div>
    `;
    }
}

customElements.define('pytron-progress-bar', PytronProgressBar);
