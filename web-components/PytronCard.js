import { LitElement, html, css } from 'lit';

export class PytronCard extends LitElement {
    static properties = {
        title: { type: String }
        // No explicit footer property; using named slot
    };

    static styles = css`
    :host {
      display: block;
      background: var(--pytron-surface, #252526);
      border: 1px solid var(--pytron-border, #333);
      border-radius: 8px;
      overflow: hidden;
      color: var(--pytron-fg, #fff);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.1s, box-shadow 0.1s;
    }

    /* Simulate "clickable" feel if user adds click listener */
    :host([clickable]) {
      cursor: pointer;
    }

    .header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--pytron-border, #333);
      font-weight: 600;
      font-size: 15px;
      font-family: 'Segoe UI', sans-serif;
    }

    .content {
      padding: 16px;
      font-family: 'Segoe UI', sans-serif;
    }

    .footer {
      padding: 12px 16px;
      background: var(--pytron-secondary, #2d2d2d);
      border-top: 1px solid var(--pytron-border, #333);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }

    /* Hide footer if slot is empty (trick requires user to use slot="footer") */
    ::slotted([slot="footer"]) {
      /* Just ensuring slotted content behaves well */
    }
  `;

    constructor() {
        super();
        this.title = '';
    }

    render() {
        return html`
      ${this.title ? html`<div class="header">${this.title}</div>` : ''}
      
      <div class="content">
        <slot></slot>
      </div>

      <div class="footer">
         <!-- Named slot for footer content -->
         <slot name="footer"></slot>
      </div>
    `;
    }

    updated() {
        // Optional: Check if footer slot is empty and hide .footer div purely via JS if CSS :empty isn't enough for shadow DOM slots
        const footerSlot = this.shadowRoot.querySelector('slot[name="footer"]');
        const footerDiv = this.shadowRoot.querySelector('.footer');
        if (footerSlot && footerDiv) {
            const nodes = footerSlot.assignedNodes();
            if (nodes.length === 0) {
                footerDiv.style.display = 'none';
            } else {
                footerDiv.style.display = 'flex';
            }
        }
    }
}

if (!customElements.get('pytron-card')) {
  customElements.define('pytron-card', PytronCard);
}
