![Pytron](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/pytron-banner.png)
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
import { TitleBar } from 'pytron-ui/react';

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
# example
![TitleBar](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/titlebar.png)

### MenuBar

A dropdown menu bar.

```jsx
import { MenuBar } from 'pytron-ui/react';

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
# example
![MenuBar](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/menu.png)
### Dialog

A modal dialog.

```jsx
import { Dialog } from 'pytron-ui/react';
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
# example
![Dialog](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/dialog.png)
### usePytron Hook

Access the Pytron backend API.

```jsx
import { usePytron } from 'pytron-ui/react';

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

### Sidebar

A collapsible sidebar navigation component.

```jsx
import { PytronSidebar, PytronSidebarItem, PytronSidebarHeader, PytronSidebarContent } from 'pytron-ui/react';
import { Home, Settings } from 'lucide-react';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
       <PytronSidebar width="250px">
          <PytronSidebarHeader>Menu</PytronSidebarHeader>
          <PytronSidebarItem icon={Home} label="Home" active />
          <PytronSidebarItem icon={Settings} label="Settings" />
       </PytronSidebar>
       <PytronSidebarContent>
          Main Content Here
       </PytronSidebarContent>
    </div>
  );
}
```
# example
![Sidebar](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/sidebar.png)

### Button

Standard button component with variants.

```jsx
import { PytronButton } from 'pytron-ui/react';

<PytronButton variant="primary" onClick={handleClick}>Click Me</PytronButton>
<PytronButton variant="secondary">Cancel</PytronButton>
<PytronButton variant="danger">Delete</PytronButton>
```
# example
![Button](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/buttons.png)

### Input & Controls

Form elements styled for the Pytron theme.

```jsx
import { PytronInput, PytronSelect, PytronSwitch } from 'pytron-ui/react';

// Input
<PytronInput placeholder="Type here..." onChange={(e) => setValue(e.target.value)} />

// Select
<PytronSelect 
  options={[{ value: '1', label: 'Option 1' }]} 
  onChange={(val) => setOption(val)} 
/>

// Switch
<PytronSwitch checked={isOn} onChange={setIsOn} />
```
# example
![Inputs](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/inputs.png)

### Feedback

Loading states and toast notifications.

```jsx
import { PytronLoader, PytronProgressBar, PytronToaster } from 'pytron-ui/react';

// Loader
<PytronLoader />

// Progress
<PytronProgressBar value={45} />

// Toaster (Must be used within ToastProvider)
const { addToast } = PytronToaster();
addToast('Saved successfully', { type: 'success' });
```
# example
![Feedback](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/feedback.png)

### Layout

Organizational components.

```jsx
import { PytronCard, PytronTabs } from 'pytron-ui/react';

// Card
<PytronCard title="My Card" footer={<button>Action</button>}>
  Card Content
</PytronCard>

// Tabs
<PytronTabs 
  tabs={[{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }]} 
  activeTab={activeTab} 
  onChange={setActiveTab} 
/>
```
# example
![Layout](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/layout.png)

### Modal

Standard modal overlay.

```jsx
import { PytronModal } from 'pytron-ui/react';

<PytronModal isOpen={show} title="Modal Title" onClose={() => setShow(false)}>
  <p>Modal content goes here.</p>
</PytronModal>
```
# example
![Modal](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/modal.png)

### Providers

Wrap your app in these providers for full functionality. you can change the color of the theme by passing the theme object to the ThemeProvider.

```jsx
import { ThemeProvider, ToastProvider } from 'pytron-ui/react';

const theme = {
  bg: '#1e1e1e',
  fg: '#ffffff',
  primary: '#0078d4'
};

<ThemeProvider theme={theme}>
  <ToastProvider>
    <App />
  </ToastProvider>
</ThemeProvider>
```
# example
![Providers](https://raw.githubusercontent.com/Ghua8088/pytron-UI/main/providers.png)
