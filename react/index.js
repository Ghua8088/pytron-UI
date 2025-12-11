import React from 'react';
import { createComponent } from '@lit/react';

// Import the Web Component classes (to ensure they are registered)
import { PytronButton } from '../web-components/PytronButton.js';
import { PytronCard } from '../web-components/PytronCard.js';
import { PytronDialog } from '../web-components/PytronDialog.js';
import { PytronInput } from '../web-components/PytronInput.js';
import { PytronLoader } from '../web-components/PytronLoader.js';
import { PytronMenuBar } from '../web-components/PytronMenuBar.js';
import { PytronModal } from '../web-components/PytronModal.js';
import { PytronProgressBar } from '../web-components/PytronProgressBar.js';
import { PytronResizeHandles } from '../web-components/PytronResizeHandles.js';
import { PytronSelect } from '../web-components/PytronSelect.js';
import { PytronShortcutHandler } from '../web-components/PytronShortcutHandler.js';
import { PytronSidebar, PytronSidebarItem, PytronSidebarHeader } from '../web-components/PytronSidebar.js';
import { PytronSnapGrid } from '../web-components/PytronSnapGrid.js';
import { PytronSwitch } from '../web-components/PytronSwitch.js';
import { PytronTabs } from '../web-components/PytronTabs.js';
import { PytronTitleBar } from '../web-components/PytronTitleBar.js';
import { PytronToaster } from '../web-components/PytronToast.js';

// --- WRAPPERS ---

export const Button = createComponent({
    tagName: 'pytron-button',
    elementClass: PytronButton,
    react: React,
    events: {
        onClick: 'click' // Standard, but good to be explicit
    }
});

export const Card = createComponent({
    tagName: 'pytron-card',
    elementClass: PytronCard,
    react: React
});

export const Dialog = createComponent({
    tagName: 'pytron-dialog',
    elementClass: PytronDialog,
    react: React,
    events: {
        onConfirm: 'confirm',
        onCancel: 'cancel'
    }
});

export const Input = createComponent({
    tagName: 'pytron-input',
    elementClass: PytronInput,
    react: React,
    events: {
        onChange: 'change',
        onInput: 'input'
    }
});

export const Loader = createComponent({
    tagName: 'pytron-loader',
    elementClass: PytronLoader,
    react: React
});

export const MenuBar = createComponent({
    tagName: 'pytron-menubar',
    elementClass: PytronMenuBar,
    react: React,
    events: {
        onItemClick: 'item-click'
    }
});

export const Modal = createComponent({
    tagName: 'pytron-modal',
    elementClass: PytronModal,
    react: React,
    events: {
        onClose: 'close'
    }
});

export const ProgressBar = createComponent({
    tagName: 'pytron-progress-bar',
    elementClass: PytronProgressBar,
    react: React
});

export const ResizeHandles = createComponent({
    tagName: 'pytron-resize-handles',
    elementClass: PytronResizeHandles,
    react: React
});

export const Select = createComponent({
    tagName: 'pytron-select',
    elementClass: PytronSelect,
    react: React,
    events: {
        onChange: 'change'
    }
});

export const ShortcutHandler = createComponent({
    tagName: 'pytron-shortcut-handler',
    elementClass: PytronShortcutHandler,
    react: React
});

export const Sidebar = createComponent({
    tagName: 'pytron-sidebar',
    elementClass: PytronSidebar,
    react: React
});

export const SidebarItem = createComponent({
    tagName: 'pytron-sidebar-item',
    elementClass: PytronSidebarItem,
    react: React,
    events: {
        onClick: 'click'
    }
});

export const SidebarHeader = createComponent({
    tagName: 'pytron-sidebar-header',
    elementClass: PytronSidebarHeader,
    react: React
});

export const SnapGrid = createComponent({
    tagName: 'pytron-snap-grid',
    elementClass: PytronSnapGrid,
    react: React,
    events: {
        onClose: 'close'
    }
});

export const Switch = createComponent({
    tagName: 'pytron-switch',
    elementClass: PytronSwitch,
    react: React,
    events: {
        onChange: 'change'
    }
});

export const Tabs = createComponent({
    tagName: 'pytron-tabs',
    elementClass: PytronTabs,
    react: React,
    events: {
        onChange: 'change'
    }
});

export const TitleBar = createComponent({
    tagName: 'pytron-titlebar',
    elementClass: PytronTitleBar,
    react: React,
    events: {
        onMinimize: 'minimize',
        onMaximize: 'maximize',
        onClose: 'close'
    }
});

export const Toaster = createComponent({
    tagName: 'pytron-toaster',
    elementClass: PytronToaster,
    react: React
});
