# Mindful Crowd Builder - Frontend

The frontend application for the Mindful Crowd Builder project, built with modern web technologies for an optimal user experience.

## Technology Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - shadcn-ui for beautiful, accessible components
- **Development Tools**:
  - ESLint for code quality
  - PostCSS for CSS processing
  - TypeScript for type safety

## Project Structure

```
frontend/
├── src/           # Source code
├── public/        # Static assets
├── components.json # shadcn-ui configuration
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.ts # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or bun package manager

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or with bun
   bun install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or with bun
   bun run dev
   ```

3. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement responsive design using Tailwind CSS
- Follow the established component structure

### Adding New Features

1. Create new components in the appropriate directory
2. Write clean, documented code
3. Ensure responsive design
4. Test thoroughly before committing

## Brand Guidelines

Please refer to `BRAND_GUIDELINES.md` for detailed information about colours, typography, and design principles.

## Deployment

The application can be built for production using:
```bash
npm run build
```

This will create an optimised build in the `dist` directory.

## Troubleshooting

Common issues and solutions:

1. **Build failures**: Clear the `.vite` cache directory
2. **Module not found**: Ensure all dependencies are installed
3. **Type errors**: Check `tsconfig.json` settings

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Create a pull request with a clear description

## Related Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
