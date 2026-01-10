import { LitElement } from 'lit';
import pytron from 'pytron-client';

export class PytronShortcutHandler extends LitElement {
    constructor() {
        super();
        this.registeredShortcuts = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        await this._fetchShortcuts();
        window.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('keydown', this._handleKeyDown.bind(this));
    }

    async _fetchShortcuts() {
        try {
            if (typeof pytron !== 'undefined' && pytron.get_registered_shortcuts) {
                this.registeredShortcuts = await pytron.get_registered_shortcuts();
            }
        } catch (e) { /* ignore */ }
    }

    async _handleKeyDown(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.metaKey) parts.push('Cmd');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');

        let key = e.key.toUpperCase();
        if (['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) return;

        parts.push(key);
        const combo = parts.join('+');

        // Optimization check
        if (this.registeredShortcuts.length > 0 && !this.registeredShortcuts.includes(combo)) {
            return;
        }

        if (typeof pytron !== 'undefined' && pytron.trigger_shortcut) {
            try {
                const handled = await pytron.trigger_shortcut(combo);
                if (handled) {
                    e.preventDefault();
                }
            } catch (err) { }
        }
    }

    render() {
        return null; // Invisible
    }
}

if (!customElements.get('pytron-shortcut-handler')) {
  customElements.define('pytron-shortcut-handler', PytronShortcutHandler);
}
