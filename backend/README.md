# Mindful Crowd Builder - Backend

The backend service for the Mindful Crowd Builder project, providing API endpoints and database management.

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Database**: SQL (as indicated by `database.sql`)
- **Development Tools**:
  - TypeScript for type safety
  - Environment configuration via `.env`

## Project Structure

```
backend/
├── src/           # Source code
├── database.sql   # Database schema
├── tsconfig.json  # TypeScript configuration
└── .env          # Environment variables
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm package manager
- SQL database server

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (if not already done)
   - Update the environment variables with your configuration

3. Set up the database:
   - Execute the SQL commands in `database.sql`
   - Ensure your database connection details match those in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` by default.

## Environment Variables

Important environment variables to configure:

- Database connection details
- Server port
- API keys and secrets
- Other service configurations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## API Documentation

The backend provides various API endpoints for the frontend application. Documentation for these endpoints should be maintained in a separate API documentation file.

### Example Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth` - Authentication endpoint
- Additional endpoints as per application requirements

## Database

The application uses a SQL database. The schema can be found in `database.sql`. Key features include:

- Table structures
- Relationships
- Indexes
- Initial seed data (if any)

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Document complex logic
- Write clear comments for public APIs

### Error Handling

- Use appropriate HTTP status codes
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases

### Security

- Validate all input
- Sanitise database queries
- Use appropriate authentication
- Follow security best practices

## Deployment

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Set up production environment variables

3. Start the server:
   ```bash
   npm start
   ```

## Troubleshooting

Common issues and solutions:

1. **Database connection issues**: Check connection string and credentials
2. **TypeScript errors**: Ensure all types are properly defined
3. **Environment variables**: Verify all required variables are set

## Contributing

1. Follow the established code style
2. Write unit tests for new features
3. Update documentation as needed
4. Create detailed pull requests

## Related Documentation

- [Node.js Documentation](https://nodejs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [SQL Best Practices](https://www.sqlstyle.guide) 