# TYPO3 Vite Demo

A TYPO3 CMS sitepackage extension demonstrating the integration of Vite as a modern frontend build tool.

## Overview

This extension showcases how to integrate Vite into a TYPO3 CMS project, enabling modern frontend development workflows with Hot Module Replacement (HMR), Vue.js support, and optimized production builds.

## Features

### Core Integration
- **Vite Integration**: Lightning-fast development server with Hot Module Replacement (HMR)
- **Vue.js 3 Support**: Full support for Vue 3 Composition API and Single File Components (SFC)
- **Bootstrap 5.3**: Modern, responsive UI framework with full component library
- **SCSS Support**: Advanced CSS preprocessing with nested rules and variables
- **DDEV Ready**: Pre-configured for DDEV local development environment
- **TYPO3 13.4 Compatible**: Built for the latest TYPO3 LTS version

### Demo Components
- **Interactive TodoList**: Fully-featured Vue 3 to-do list application with:
  - Add, complete, and delete tasks
  - Filter by All/Active/Completed
  - Session storage persistence (data survives page reloads)
  - Bootstrap 5.3 styled interface
  - Full keyboard navigation support
  - Screen reader accessible (WCAG compliant)
  - Live region announcements for actions

### Modern Frontend Stack
- **Bootstrap 5.3**: Responsive grid, components, and utilities

### Developer Experience
- **TypeScript Ready**: Prepared for TypeScript integration
- **Hot Module Replacement**: Instant updates without full page reload
- **Development & Production Modes**: Optimized builds for each environment
- **Asset Manifest**: Automatic cache-busting with hashed filenames
- **DDEV Commands**: Custom shortcuts for common tasks

## Requirements

- TYPO3 13.4.x
- Node.js 22
- PHP 8.3+
- DDEV (recommended for local development)

> **📋 Cross-Platform Note:** This project works identically on Windows, macOS, and Linux. See [CROSS_PLATFORM.md](../../CROSS_PLATFORM.md) for details.

### TYPO3 Dependencies

- `typo3/cms-core`: ^13.4
- `typo3/cms-rte-ckeditor`: ^13.4
- `typo3/cms-fluid-styled-content`: ^13.4

## Installation

### 1. Install the Extension

```bash
composer require matthias-peltzer/typo3-vite-demo
```

### 2. Install Frontend Dependencies

All frontend dependencies (Vite, Vue, Bootstrap) are contained within the extension directory:

```bash
# Using DDEV (recommended)
ddev pnpm install

# Or locally
cd packages/typo3_vite_demo
pnpm install
```

## Development Workflow

### Development Mode (DDEV)

For DDEV environments, use the custom command:

```bash
ddev vite-serve start
```

This starts the Vite development server inside the DDEV container with:
- Hot Module Replacement (HMR)
- WebSocket Secure (WSS) for DDEV
- CORS enabled for cross-origin requests
- CSS source maps enabled
- Accessible at `https://typo3-vite-demo.ddev.site:5173`
- Runs from `packages/typo3_vite_demo` directory

Stop the server with:

```bash
ddev vite-serve stop
```

Check server status:

```bash
ddev vite-serve status
```

### Development Mode (Local)

For local development without DDEV:

```bash
cd packages/typo3_vite_demo
pnpm dev
```

**Note**: Make sure your TYPO3 is in Development mode (not Production) in your `.env` file to load assets from the Vite dev server.

### Production Build

Build optimized assets for production:

```bash
# Using DDEV
ddev pnpm build

# Or locally
cd packages/typo3_vite_demo
pnpm build
```

This will:
- Bundle and minify JavaScript
- Process and optimize CSS
- Generate a manifest.json file
- Output files to `Resources/Public/Vite/`

### Preview Production Build

Preview the production build locally:

```bash
# Using DDEV
ddev pnpm preview

# Or locally
cd packages/typo3_vite_demo
pnpm preview
```

## Project Structure

```
typo3_vite_demo/
├── Classes/
│   ├── Controller/
│   │   └── VueComponentController.php # Controller for Vue component plugins
│   ├── UserFunctions/
│   │   └── InsertViteAssets.php       # Integrates Vite assets into TYPO3
│   └── ViewHelpers/
├── Configuration/
│   ├── Services.yaml                  # Dependency injection configuration
│   ├── TCA/
│   │   └── Overrides/
│   │       └── tt_content.php         # Register Vue plugins as content elements
│   ├── TsConfig/                      # Page TSconfig
│   └── TypoScript/                    # TypoScript setup and constants
│       └── VueComponents.typoscript   # Vue plugin configuration
├── Resources/
│   ├── Private/
│   │   ├── JavaScript/
│   │   │   ├── Components/            # Vue 3 components
│   │   │   │   └── TodoList.vue       # Interactive todo list demo
│   │   │   ├── bootstrap-init.js      # Bootstrap components initialization
│   │   │   └── main.js                # Main entry point & Vue setup
│   │   ├── Scss/
│   │   │   ├── _colors.scss           # Color variables
│   │   │   └── main.scss              # Main stylesheet
│   │   ├── Templates/
│   │   │   ├── Page/                  # Page templates
│   │   │   └── VueComponent/          # Vue component plugin templates
│   │   │       └── TodoList.html
│   │   ├── Layouts/
│   │   │   ├── Page.html              # Page layout
│   │   │   └── VueComponent.html      # Vue component layout
│   │   └── Partials/                  # Fluid partials
│   └── Public/
│       ├── Icons/
│       │   └── TodoList.svg           # Custom icon for TodoList plugin
│       └── Vite/                      # Built assets (generated by `pnpm build`)
│           ├── assets/
│           └── manifest.json          # Asset manifest for production
├── node_modules/                      # Frontend dependencies (gitignored)
├── package.json                       # Frontend dependencies & scripts
├── pnpm-lock.yaml                     # Lockfile for reproducible builds
├── vite.config.js                     # Vite configuration
└── ext_localconf.php                  # Extension configuration (registers plugins & icons)
```

**Note**: All Vite and pnpm related files are self-contained within the extension directory, making it portable and easy to manage.

## How It Works

### Vue Component System

The project provides two ways to use Vue components:

1. **Direct Template Integration**: Embed components directly in Fluid templates using `<div data-container="vue" data-component="ComponentName"></div>`
2. **Backend Content Elements**: Add components as plugins through the TYPO3 backend interface

Components are automatically initialized by the main.js entry point, which scans for `[data-container="vue"]` elements and mounts the appropriate Vue component.

**Note**: All plugins are registered using the modern `CType` approach (not the deprecated `list_type`), following TYPO3 v13+ best practices.

### Dependency Injection

Controllers and services are auto-registered using `Configuration/Services.yaml`:
- Controllers are made public and tagged with `controller.service_arguments`
- Autowiring is enabled for automatic dependency injection
- All classes in the `Classes/` directory are auto-configured

### Icon Registry

Custom icons for backend plugins are registered in `ext_localconf.php` using TYPO3's IconRegistry service with the SvgIconProvider.

### Vite Asset Integration

The `InsertViteAssets` PHP class reads the Vite-generated `manifest.json` and dynamically inserts the correct script and stylesheet tags into your TYPO3 templates.

**Key Features:**
- Automatic manifest parsing
- Dynamic asset path resolution
- Support for code-split CSS files
- Production-ready asset URLs
- Context-aware loading (Development vs Production)

### Vite Configuration

The Vite configuration includes:

- **Development Server**: Configured for DDEV with HTTPS and WSS
- **HMR**: Hot Module Replacement over secure WebSocket
- **Vue Plugin**: Enables Vue.js Single File Component support
- **SCSS Compilation**: Uses `sass-embedded` for fast CSS preprocessing
- **Build Manifest**: Generates manifest.json for TYPO3 integration
- **Custom Entry Point**: Uses `main.js` instead of default `index.html`

### TypoScript Context Detection

The setup automatically detects the application context:
- **Development Mode** (`Development/*`): Loads assets from Vite dev server at port 5173
- **Production Mode** (`Production/*`): Loads pre-built assets from manifest.json

### DDEV Integration

The project is configured to work seamlessly with DDEV:

- Vite dev server accessible at `https://typo3-vite-demo.ddev.site:5173`
- WebSocket support for HMR
- CORS enabled for cross-origin asset loading
- Custom DDEV commands available in `.ddev/commands/`

## Usage in TYPO3 Templates

The Vite assets are inserted using the `InsertViteAssets` user function. In your Fluid templates or TypoScript setup, the assets are automatically included.

Example output in production:

```html
<!-- Vite Assets -->
<script src="/typo3conf/ext/typo3_vite_demo/Resources/Public/Vite/assets/main-jM6z-bW9.js" defer></script>
<link rel="stylesheet" href="/typo3conf/ext/typo3_vite_demo/Resources/Public/Vite/assets/main-CXwsMyQZ.css">
```

## Available Libraries

### Bootstrap

Bootstrap 5.3 is included with all components automatically initialized in `bootstrap-init.js`:

```javascript
import 'bootstrap';
```

All Bootstrap components are available: Alert, Button, Carousel, Collapse, Dropdown, Modal, Offcanvas, Popover, ScrollSpy, Tab, Toast, and Tooltip.

### Vue.js

The project includes a fully-featured TodoList component demonstrating Vue 3 Composition API:

**Features:**
- Reactive state management
- Session storage persistence
- Computed properties for filtering
- Component lifecycle hooks
- Accessible with ARIA labels

**Usage in Templates:**

Add Vue components to any Fluid template:

```html
<div data-container="vue" data-component="TodoList"></div>
```

**Create New Components:**

Create a new `.vue` file in `Resources/Private/JavaScript/Components/`:

```vue
<script setup>
import { ref } from 'vue';
const message = ref('Hello from Vue 3!');
</script>

<template>
  <div>{{ message }}</div>
</template>

<style scoped>
div { color: blue; }
</style>
```

Register it in `main.js`:

```javascript
import YourComponent from './Components/YourComponent.vue';

// In the switch statement:
case 'YourComponent': {
  createApp(YourComponent).mount(element);
  break;
}
```

## License

GPL-2.0-or-later

## Author

**Matthias Peltzer**
- Email: mail@mpeltzer.de
- Website: https://www.mpeltzer.de/

## Contributing

This is a demonstration project showcasing Vite integration in TYPO3. Feel free to use it as a template for your own projects.

## TodoList Component Demo

The included TodoList component showcases best practices for Vue 3 development:

### Features
- **State Management**: Reactive todo list with Vue 3 Composition API
- **Persistence**: Session storage (data persists across page reloads)
- **Filtering**: View All, Active, or Completed tasks
- **Bootstrap Styling**: Clean, responsive UI with Bootstrap 5.3
- **Accessibility**: Full WCAG compliance with:
  - Keyboard navigation
  - Screen reader support
  - Live region announcements
  - Proper ARIA labels
  - Focus management

### Using Vue Components as Backend Content Elements

The TodoList component is available as a **TYPO3 content element** that editors can insert from the backend:

#### Adding to a Page:

1. Edit a page in the TYPO3 backend
2. Click "+ Content" to add a new content element
3. Select "Plugins" tab
4. Choose "Vue: TodoList"
5. Save and view the page

The TodoList will now be rendered on that page!

#### Display Control in Templates

You can also embed the TodoList directly in Fluid templates:

**Show only on homepage:**
```html
<f:if condition="{data.is_siteroot}">
    <div data-container="vue" data-component="TodoList"></div>
</f:if>
```

**Show on all pages:**
```html
<div data-container="vue" data-component="TodoList"></div>
```

### Creating Additional Vue Component Plugins

To make other Vue components available as backend content elements:

#### 1. Create the Vue Component
Create your component in `Resources/Private/JavaScript/Components/YourComponent.vue`

#### 2. Register in main.js
Add to the switch statement in `main.js`:
```javascript
case 'YourComponent': {
  createApp(YourComponent).mount(element);
  break;
}
```

#### 3. Register Icon (Optional)
Add to `ext_localconf.php` after the RTE configuration:
```php
$iconRegistry->registerIcon(
    'typo3-vite-demo-yourcomponent',
    SvgIconProvider::class,
    ['source' => 'EXT:typo3_vite_demo/Resources/Public/Icons/YourComponent.svg']
);
```

Create your icon as an SVG file in `Resources/Public/Icons/YourComponent.svg`.

Note: For simple Vue wrapper components, you don't need an Extbase controller or `configurePlugin()` - the TypoScript configuration handles rendering directly!

#### 4. Register in TCA
Add to `Configuration/TCA/Overrides/tt_content.php`:
```php
ExtensionUtility::registerPlugin(
    'Typo3ViteDemo',
    'YourComponent',
    'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_yourcomponent',
    'typo3-vite-demo-yourcomponent',  // Icon identifier (if registered)
    'plugins',
    'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_yourcomponent.description'
);

// Add label for the CType in the columns configuration (TYPO3 13 requirement)
$GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
    'label' => 'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_yourcomponent',
    'value' => 'typo3vitedemo_yourcomponent',
    'icon' => 'typo3-vite-demo-yourcomponent',
    'group' => 'plugins',
    'description' => 'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_yourcomponent.description',
];

// Register icon for the CType in list view
$GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['typo3vitedemo_yourcomponent'] = 'typo3-vite-demo-yourcomponent';

// Define TCA showitem configuration for the CType
$GLOBALS['TCA']['tt_content']['types']['typo3vitedemo_yourcomponent'] = [
    'showitem' => '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;;general,
            --palette--;;headers,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:appearance,
            --palette--;;frames,
            --palette--;;appearanceLinks,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
            --palette--;;language,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
            --palette--;;hidden,
            --palette--;;access,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
            rowDescription,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
    ',
];
```

Important notes:
- Use LLL (Language Label List) references instead of hardcoded strings
- The explicit `$GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][]` is required in TYPO3 13 to properly register the label and avoid "MISSING LABEL" errors

#### 5. Add Language Labels
Add to `Resources/Private/Language/locallang_db.xlf` inside the `<body>` tag:
```xml
<!-- Base label (required for CType) -->
<trans-unit id="typo3vitedemo_yourcomponent">
    <source>Vue: Your Component</source>
</trans-unit>
<!-- Optional: name and description for additional metadata -->
<trans-unit id="typo3vitedemo_yourcomponent.name">
    <source>Vue: Your Component</source>
</trans-unit>
<trans-unit id="typo3vitedemo_yourcomponent.description">
    <source>Short description of your component that appears in the backend.</source>
</trans-unit>
```

#### 6. Configure TypoScript
Add to `Configuration/TypoScript/VueComponents.typoscript`:
```typoscript
# CType configuration for Vue YourComponent
tt_content.typo3vitedemo_yourcomponent =< lib.contentElement
tt_content.typo3vitedemo_yourcomponent {
    templateName = YourComponent
    templateRootPaths {
        0 = EXT:typo3_vite_demo/Resources/Private/Templates/VueComponent/
    }
    partialRootPaths {
        0 = EXT:typo3_vite_demo/Resources/Private/Partials/
    }
    layoutRootPaths {
        0 = EXT:typo3_vite_demo/Resources/Private/Layouts/
    }
}
```

Important: For CType content elements, use `tt_content.typo3vitedemo_yourcomponent` NOT the old `tt_content.list.20.typo3vitedemo_yourcomponent` path!

#### 7. Create Template
Create `Resources/Private/Templates/VueComponent/YourComponent.html`:
```html
<f:layout name="VueComponent" />
<f:section name="Main">
    <div data-container="vue" data-component="YourComponent"></div>
</f:section>
```

#### 8. Clear Cache
```bash
ddev exec vendor/bin/typo3 cache:flush
```

Your Vue component is now available in the backend with a custom icon and description!

## DDEV Commands

Custom DDEV commands are available in `.ddev/commands/host/`:

- `ddev vite-serve start` - Start Vite dev server
- `ddev vite-serve stop` - Stop Vite dev server
- `ddev vite-serve status` - Check server status
- `ddev app-t3cache` - Clear TYPO3 cache
- `ddev app-t3logs` - View TYPO3 logs

## Troubleshooting

### Components Not Showing

1. **Check Vite is running**:
   ```bash
   ddev vite-serve status
   ```

2. **Check TYPO3 is in Development mode**:
   - Ensure `.env` has `TYPO3_CONTEXT=Development/Docker`
   - Not `Production/Staging`

3. **Clear TYPO3 cache**:
   ```bash
   ddev exec vendor/bin/typo3 cache:flush
   ```

4. **Hard refresh browser**:
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

### HMR Not Working

Ensure the Vite dev server is running inside DDEV:

```bash
ddev vite-serve start
```

### Assets Not Loading in Production

1. Build assets:
   ```bash
   pnpm build
   ```

2. Verify `manifest.json` exists:
   ```bash
   ls -la packages/typo3_vite_demo/Resources/Public/Vite/manifest.json
   ```

3. Set TYPO3 to Production mode in `.env`:
   ```
   TYPO3_CONTEXT=Production/Staging
   ```

### DDEV CORS Issues

Verify that the Vite server configuration matches your DDEV project URL in `vite.config.js`:

```javascript
origin: 'https://typo3-vite-demo.ddev.site:5173'
```

### Vue Components Return "Unknown component"

Check that:
1. Component is imported in `main.js`
2. Component name matches in the switch statement
3. `data-component` attribute matches the case name exactly
