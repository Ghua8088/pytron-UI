import { LitElement, html, css } from 'lit';

const CloseIcon = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>`;
const InfoIcon = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
const SuccessIcon = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>`;
const WarningIcon = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ErrorIcon = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

// The PytronToaster is a container that users place once in their app.
// It listens to 'pytron-toast' events or method calls.
export class PytronToaster extends LitElement {
  static properties = {
    toasts: { type: Array, state: true }
  };

  static styles = css`
    :host {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none; /* Allow clicks through empty space */
      font-family: 'Segoe UI', sans-serif;
    }

    .toast-item {
      pointer-events: auto;
      background: var(--pytron-surface, #2b2b2b);
      border: 1px solid var(--pytron-border, #333);
      border-radius: 6px;
      padding: 12px 16px;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.4);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      color: var(--pytron-fg, #fff);
      
      /* Animation */
      opacity: 0;
      transform: translateY(50px) scale(0.9);
      animation: slide-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .toast-item.exiting {
      animation: slide-out 0.2s ease-in forwards;
    }

    @keyframes slide-in {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes slide-out {
      to { opacity: 0; transform: translateX(100px) scale(0.9); }
    }

    .icon-area {
      margin-top: 2px;
    }

    .content {
      flex: 1;
    }

    .title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .message {
      font-size: 13px;
      line-height: 1.4;
      opacity: 0.9;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--pytron-fg, #fff);
      opacity: 0.5;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }

    .close-btn:hover {
      opacity: 1;
    }
  `;

  constructor() {
    super();
    this.toasts = [];
  }

  connectedCallback() {
    super.connectedCallback();
    // Listen for custom event 'pytron-toast' on window
    window.addEventListener('pytron-toast', this._handleToastEvent.bind(this));
    // Listen for pytron backend notifications
    window.addEventListener('pytron:notification', this._handleBackendNotification.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('pytron-toast', this._handleToastEvent.bind(this));
    window.removeEventListener('pytron:notification', this._handleBackendNotification.bind(this));
  }

  // Allow static access for easy calls: PytronToaster.toast('Msg')
  // Note: This requires <pytron-toaster> to be in DOM.
  static toast(message, options = {}) {
    window.dispatchEvent(new CustomEvent('pytron-toast', { detail: { message, ...options } }));
  }

  _handleToastEvent(e) {
    const { message, title, type = 'info', duration = 5000 } = e.detail;
    this.addToast(message, { title, type, duration });
  }

  _handleBackendNotification(e) {
    const { message, title, type = 'info', duration = 5000 } = e.detail || {};
    this.addToast(message, { title, type, duration });
  }

  addToast(message, options = {}) {
    const id = Date.now().toString() + Math.random();
    const newToast = {
      id,
      message,
      title: options.title,
      type: options.type || 'info', // info, success, warning, error
      duration: options.duration || 5000,
      exiting: false
    };

    // Immutable update
    this.toasts = [...this.toasts, newToast];

    if (newToast.duration > 0) {
      setTimeout(() => {
        this._startExit(id);
      }, newToast.duration);
    }
  }

  _startExit(id) {
    this.toasts = this.toasts.map(t => t.id === id ? { ...t, exiting: true } : t);
    setTimeout(() => {
      this._removeToast(id);
    }, 200); // Match animation duration
  }

  _removeToast(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  _getIcon(type) {
    switch (type) {
      case 'success': return { icon: SuccessIcon, color: 'var(--pytron-success, #107c10)' };
      case 'error': return { icon: ErrorIcon, color: 'var(--pytron-danger, #e81123)' };
      case 'warning': return { icon: WarningIcon, color: 'var(--pytron-warning, #d83b01)' };
      default: return { icon: InfoIcon, color: 'var(--pytron-primary, #0078d4)' };
    }
  }

  render() {
    return html`
      ${this.toasts.map(toast => {
      const { icon, color } = this._getIcon(toast.type);
      return html`
          <div 
            class="toast-item ${toast.exiting ? 'exiting' : ''}" 
            style="border-left: 4px solid ${color}"
            key="${toast.id}"
          >
            <div class="icon-area" style="color: ${color}">${icon}</div>
            <div class="content">
              ${toast.title ? html`<div class="title">${toast.title}</div>` : ''}
              <div class="message">${toast.message}</div>
            </div>
            <button class="close-btn" @click="${() => this._startExit(toast.id)}">
              ${CloseIcon}
            </button>
          </div>
        `;
    })}
    `;
  }
}

customElements.define('pytron-toaster', PytronToaster);
