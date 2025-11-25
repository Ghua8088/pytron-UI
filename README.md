# Banner: pytron.png
![Pytron](/pytron/pytron.png)
# Pytron UI

A set of React components and hooks for building Pytron applications.

## Installation

```bash
npm install pytron-ui
```

## Usage

### TitleBar

A custom title bar that handles window dragging and controls (minimize, maximize, close).

```jsx
import { TitleBar } from 'pytron-ui';

function App() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TitleBar title="My App" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* App content */}
      </div>
    </div>
  );
}
```

### MenuBar

A dropdown menu bar.

```jsx
import { MenuBar } from 'pytron-ui';

function App() {
  const menus = [
    {
      label: 'File',
      items: [
        { label: 'Open', onClick: () => console.log('Open'), shortcut: 'Ctrl+O' },
        { separator: true },
        { label: 'Exit', onClick: () => window.pywebview.api.close() }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'About', onClick: () => console.log('About') }
      ]
    }
  ];

  return <MenuBar menus={menus} />;
}
```

### Dialog

A modal dialog.

```jsx
import { Dialog } from 'pytron-ui';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      <Dialog
        isOpen={isOpen}
        title="Confirm"
        message="Are you sure?"
        onConfirm={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
```

### usePytron Hook

Access the Pytron backend API.

```jsx
import { usePytron } from 'pytron-ui';

function App() {
  const { api, isReady } = usePytron();

  const handleAction = async () => {
    if (isReady) {
      await api.my_python_function();
    }
  };

  return <button onClick={handleAction}>Call Python</button>;
}
```
