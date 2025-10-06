# Copilot Instructions for blog-next

This document provides essential guidance for AI coding agents working on the **blog-next** project, a modern full-stack blog system built with React 19 + Vite 7 + TypeScript + Ant Design v5 (frontend) and Koa 2 + MySQL 8 + Sequelize ORM (backend).

## Project Overview

**blog-next** is a complete rewrite of a blog system using modern technologies:
- **Frontend**: React 19, Vite 7, TypeScript, Ant Design v5
- **Backend**: Koa 2, MySQL 8, Sequelize ORM
- **Architecture**: Feature-based modular architecture with clear separation of concerns

## Architecture

### Frontend Structure

```
src/
├── app/                    # Application configuration layer
│   ├── providers/         # Global providers (React Query, Theme, Router)
│   ├── routes/            # Route configuration with lazy loading
│   └── styles/            # Global styles and CSS variables
├── features/              # Feature modules (domain-based)
│   ├── article/          # Article functionality
│   ├── auth/             # Authentication system
│   ├── comment/          # Comment system
│   └── admin/            # Admin dashboard
├── shared/               # Shared resources
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── api/              # API client configuration
│   ├── stores/           # Zustand state management
│   ├── types/            # TypeScript type definitions
│   └── constants/        # Application constants
└── design-system/        # Design system (Moe UI)
    ├── tokens/           # Design tokens (colors, spacing, etc.)
    ├── themes/           # Theme configuration
    └── components/       # Styled UI components
```

### Backend Structure

```
server/
├── controllers/   # Request handlers
├── models/        # Sequelize data models
├── router/        # Route definitions
├── middlewares/   # Koa middleware
├── utils/         # Utility functions
└── config/        # Configuration files
```

## Key Technologies & Patterns

### State Management
- **TanStack Query (React Query)**: Server state management, caching, and data fetching
- **Zustand**: Client state management (authentication, theme, application state)
- Principle: Use React Query for API data; Zustand for UI state

### Routing
- **React Router v7**: Declarative routing with lazy loading support
- Route configuration in `src/app/routes/`
- Protected routes using `ProtectedRoute` component for permission checks

### Styling
- **Ant Design v5**: Component library with Token API for theme customization
- **Less**: CSS preprocessor with CSS Modules support
- Custom "Moe UI" design system with pink/blue color scheme
- Theme tokens defined in `src/design-system/tokens/`

### API Communication
- **Axios**: HTTP client with interceptors for authentication and error handling
- Request deduplication and encryption configured
- Base URL configured via `VITE_API_BASE_URL` environment variable
- API proxy configured in `vite.config.ts` for development

### Authentication
- GitHub OAuth login
- JWT stored in localStorage (encrypted)
- Authentication state managed by Zustand
- Admin routes require `role = 1`
- Protected routes wrapped with `ProtectedRoute` component

## Path Aliases

Use these aliases for imports (configured in `vite.config.ts`):

```typescript
@/           → src/
@app/        → src/app/
@features/   → src/features/
@shared/     → src/shared/
@design-system/ → src/design-system/
@components/ → src/shared/components/
@utils/      → src/shared/utils/
@hooks/      → src/shared/hooks/
@api/        → src/shared/api/
@stores/     → src/shared/stores/
@types/      → src/shared/types/
@assets/     → src/shared/assets/
```

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start frontend development server (port 3000)
npm run dev

# Start backend development server (port 6060)
cd server && npm run dev

# Code checking
npm run lint

# Code formatting
npm run format
```

### Building
```bash
# Production build
npm run build

# Docker build (without TypeScript type checking)
npm run build:docker

# Build with bundle analysis
npm run build:analyze

# Preview production build
npm run preview
```

### Testing
```bash
# Run tests in watch mode
npm test

# Test UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Docker Development
```bash
# Start all services (web + server + mysql)
docker-compose up -d

# View service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web      # Frontend
docker-compose logs -f server   # Backend
docker-compose logs -f mysql    # Database

# Stop all services
docker-compose down

# Stop services and remove data volumes
docker-compose down -v

# Rebuild specific service
docker-compose build --no-cache web
docker-compose build --no-cache server

# Enter container to execute commands
docker-compose exec web sh       # Frontend container
docker-compose exec server sh    # Backend container
docker-compose exec mysql bash   # Database container
```

## Database Models

Key models in the backend:
- **User**: GitHub OAuth login, role-based permissions
- **Article**: Markdown content with categories and tags
- **Category**: Article categories
- **Tag**: Article tag system
- **Comment**: Nested comment/reply system
- **Fragment**: Short text/fragment functionality

Database initialization scripts in `docker/mysql/init/`

## Coding Standards

### Component Organization
- **Page components**: Create in `src/features/[domain]/pages/`
- **Reusable components**: Create in `src/shared/components/`
- Each component folder should contain:
  - Component file (`.tsx`)
  - Constants file (`constants.ts`) if needed
  - Utility file (`utils.ts`) for business logic
  - Style file (`.less`)
  - Export via `index.ts`

### Code Style
- Use TypeScript strict mode
- Only use functional components and Hooks
- Components use PascalCase naming, files/functions use camelCase
- Prefer named exports over default exports
- Separate UI logic from business logic
- Event handler naming: Use descriptive verbs + object (e.g., `submitForm` not `handleClick`)

### API Hooks Pattern
- All API calls use TanStack Query
- Query keys defined in `src/shared/api/queryKeys.ts`
- Mutations handle optimistic updates when appropriate
- Example:
  ```typescript
  const { data, isLoading } = useQuery({
    queryKey: ['articles', id],
    queryFn: () => fetchArticle(id)
  })
  ```

## Testing Strategy

- **Vitest**: Unit testing framework
- **Testing Library**: React component testing
- Test files colocated with components (`*.test.tsx`)
- Use MSW (Mock Service Worker) to mock API calls
- **Docker test environment**: Tests should run in Docker containers for environment consistency

## Deployment

### Docker Deployment (Recommended)
1. Configure `.env` file (copy from `.env.example`)
2. Run `docker-compose up -d`
3. Services:
   - Web (Nginx): Ports 80/443
   - Server (Koa): Port 6060 (internal)
   - MySQL: Port 3306

### Manual Deployment
1. Build frontend: `npm run build`
2. Start backend: `cd server && npm run dev`
3. Serve `dist/` folder with nginx/serve
4. Configure MySQL database

## Important Notes

1. **Docker First**: Development and testing should prioritize Docker environments
2. **Environment Consistency**: Ensure local and CI/CD environments match
3. **Database Testing**: Must run in Docker containers
4. **Build Differences**: 
   - Local: `npm run build` (includes TypeScript checking)
   - Docker: `npm run build:docker` (skips type checking for speed)
5. **Database Initialization**: First Docker startup automatically runs SQL scripts in `docker/mysql/init/`

## Common Patterns

### Error Handling
- API errors are handled globally in `src/shared/utils/request.ts`
- 401 errors automatically clear tokens and redirect to login
- User-friendly error messages displayed via Ant Design's message component

### Performance Optimization
- Route-based code splitting (lazy loading)
- Image lazy loading with `LazyLoad` component
- `useMemo`/`useCallback` for expensive operations
- Bundle analysis with `npm run build:analyze`

### Security
- XSS protection with DOMPurify
- Token-based authentication with JWT
- Encrypted token storage
- Input validation with Joi on backend

This guidance should help AI coding agents be immediately productive in this codebase. Always refer to existing implementations when adding new features to maintain consistency.