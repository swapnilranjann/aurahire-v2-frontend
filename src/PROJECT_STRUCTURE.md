# Project Structure Documentation

## Overview

This document outlines the organization and architecture of the JobPortal frontend application.

## Directory Structure

```
src/
├── components/               # Reusable UI components
│   ├── common/              # Shared utility components
│   │   ├── ErrorBoundary.jsx    # Global error handler
│   │   ├── ScrollToTop.jsx      # Auto-scroll on route change
│   │   └── PageTitle.jsx        # Dynamic document title
│   ├── layout/              # Page layout components
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Footer.jsx           # Site footer
│   │   └── Layout.jsx           # Main layout wrapper
│   ├── header/              # Header-specific components
│   ├── footer/              # Footer-specific components
│   └── assets/              # Static assets
│       ├── logo.png             # Site logo
│       ├── head-EDIT.jpg        # Background image
│       ├── sl1.jpg              # Slider image 1
│       ├── sl2.jpg              # Slider image 2
│       ├── sl3.jpg              # Slider image 3
│       └── pexels-*.jpg         # Additional images
│
├── pages/                   # Page components (routes)
│   ├── Home.jsx                 # Homepage
│   ├── About.jsx                # About us page
│   ├── Contact.jsx              # Contact form page
│   ├── Alljobs.jsx              # Job listings page
│   ├── HeroSlider.jsx           # Primary hero carousel
│   ├── HeroSlider2.jsx          # Secondary hero carousel
│   └── NotFound.jsx             # 404 error page
│
├── routers/                 # Routing configuration
│   └── Routers.js               # Route definitions
│
├── styles/                  # CSS stylesheets
│   ├── header.css               # Header styles
│   ├── footer.css               # Footer styles
│   ├── Home.css                 # Home page styles
│   ├── About.css                # About page styles
│   ├── Contact.css              # Contact page styles
│   ├── Alljobs.css              # Jobs page styles
│   ├── hero-slider.css          # Primary slider styles
│   └── hero-slider2.css         # Secondary slider styles
│
├── utils/                   # Utility functions and constants
│   └── constants.js             # App-wide constants
│
├── App.js                   # Root application component
├── index.js                 # Application entry point
└── index.css                # Global styles & CSS variables
```

## Import Path Examples

### From a page component:
```javascript
// Importing styles
import "../styles/Home.css";

// Importing other page components
import HeroSlider from "./HeroSlider";

// Importing constants
import { FEATURED_JOBS } from '../utils/constants';
```

### From a layout component:
```javascript
// Importing styles (from components/layout/)
import "../../styles/header.css";

// Importing assets
import logo from "../assets/logo.png";

// Importing router
import Routers from "../../routers/Routers";
```

### From App.js:
```javascript
import Layout from "./components/layout/Layout";
import ErrorBoundary from './components/common/ErrorBoundary';
```

## Component Hierarchy

```
App
└── ErrorBoundary
    └── BrowserRouter
        └── Layout
            ├── Header
            ├── Main (Routers)
            │   ├── ScrollToTop
            │   ├── PageTitle
            │   └── Suspense
            │       └── Routes
            │           ├── Home
            │           │   ├── HeroSlider
            │           │   └── HeroSlider2
            │           ├── About
            │           ├── Contact
            │           ├── Alljobs
            │           └── NotFound
            └── Footer
```

## Key Design Patterns

### 1. Lazy Loading
Routes are lazy-loaded for better performance:
```javascript
const Home = lazy(() => import('../pages/Home'));
```

### 2. Error Boundaries
The app is wrapped in an ErrorBoundary for graceful error handling.

### 3. CSS Variables
Global design tokens are defined in `index.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  /* ... */
}
```

### 4. Centralized Constants
All static data is stored in `utils/constants.js` for easy maintenance.

### 5. Semantic HTML
All components use semantic HTML elements with proper ARIA attributes.

## Style Organization

Each page has its own CSS file with consistent naming:
- Component: `Home.jsx` → Style: `Home.css`
- Styles are scoped using specific class prefixes

## Best Practices

1. **Component Naming**: PascalCase for components (e.g., `HeroSlider.jsx`)
2. **Style Files**: Match component names (e.g., `hero-slider.css`)
3. **Constants**: SCREAMING_SNAKE_CASE (e.g., `FEATURED_JOBS`)
4. **CSS Classes**: kebab-case (e.g., `.job-card`)
5. **Imports**: Absolute imports from src/ root when possible

## Adding New Features

### Adding a new page:
1. Create component in `src/pages/NewPage.jsx`
2. Create styles in `src/styles/NewPage.css`
3. Add route in `src/routers/Routers.js`
4. Update `PageTitle.jsx` with new route title
5. Add navigation link if needed

### Adding a new shared component:
1. Create component in `src/components/common/ComponentName.jsx`
2. Export and import where needed

## Performance Considerations

- Images should be optimized before adding to assets
- Use lazy loading for below-the-fold content
- Minimize CSS by removing unused styles
- Use CSS variables for theming (reduces repaints)


