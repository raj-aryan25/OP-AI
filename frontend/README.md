# Multi-Dashboard Frontend

A React + TypeScript frontend application built with Vite, featuring three distinct role-based dashboards with clean architecture and scalable folder structure.

## 🚀 Features

- **Three Role-Based Dashboards**: Admin, Operator, and User interfaces
- **React Router v6**: Client-side routing with nested routes
- **TypeScript**: Full type safety throughout the application
- **Vite**: Lightning-fast development and optimized production builds
- **Clean Architecture**: Organized folder structure for scalability
- **Modular Design**: Component-based architecture with reusable patterns

## 📁 Project Structure

```
src/
 ├─ app/
 │   ├─ router.tsx           # Application routing configuration
 │   ├─ layouts/             # Shared layout components
 │   │   └─ MainLayout/      # Main layout with navigation
 │   └─ guards/              # Route guards and authentication
 ├─ dashboards/
 │   ├─ admin/               # Admin dashboard
 │   ├─ operator/            # Operator dashboard
 │   └─ user/                # User dashboard
 ├─ components/              # Shared/reusable components
 ├─ services/                # API services and data fetching
 ├─ hooks/                   # Custom React hooks
 ├─ types/                   # TypeScript type definitions
 ├─ mock/                    # Mock data for development
 ├─ App.tsx                  # Root component
 ├─ main.tsx                 # Application entry point
 └─ index.css                # Global styles
```

## 🛠️ Tech Stack

- **React** 19.2.0 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.2.4 - Build tool and dev server
- **React Router** 6.22.0 - Client-side routing
- **ESLint** - Code linting and formatting

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Routes

- `/` - Redirects to User Dashboard
- `/admin` - Admin Dashboard (system management)
- `/operator` - Operator Dashboard (daily operations)
- `/user` - User Dashboard (personal workspace)

## 🎨 Dashboard Features

### Admin Dashboard
- System overview and monitoring
- User management capabilities
- Analytics and reporting tools

### Operator Dashboard
- Task queue management
- Performance metrics monitoring
- System notifications and alerts

### User Dashboard
- Personal profile management
- Activity tracking
- User preferences and settings

## 🔧 Development

### Adding New Components

Place shared components in `src/components/`:
```typescript
// src/components/Button/Button.tsx
export default function Button() {
  return <button>Click me</button>;
}
```

### Adding New Services

Place API services in `src/services/`:
```typescript
// src/services/api.ts
export const fetchData = async () => {
  // API call logic
};
```

### Adding Custom Hooks

Place custom hooks in `src/hooks/`:
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  // Hook logic
};
```

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, optimized and minified for production deployment.

## 🤝 Contributing

This is a foundational template. Extend it by:
- Adding authentication/authorization in `app/guards/`
- Implementing API integrations in `services/`
- Creating reusable UI components in `components/`
- Adding TypeScript interfaces in `types/`
- Developing mock data in `mock/` for testing

## 📝 License

MIT License
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
