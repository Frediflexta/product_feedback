# Product Feedback Backend

A robust backend API for managing product feedback, feature requests, and user comments built with Node.js, Express, TypeScript, and Prisma.

## Features

- 🔐 User authentication and authorization
- 📝 Product request management (CRUD operations)
- 💬 Nested comments and replies system
- 📊 Feedback categorization and status tracking
- 🔄 Database migrations with Prisma
- 🧪 Test setup with Jest and Supertest
- 📡 RESTful API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Testing**: Jest + Supertest
- **Development**: Nodemon, ts-node

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) database

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Frediflexta/product_feedback.git
cd product_feedback_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/product_feedback_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Optional: Port (defaults to 3000)
PORT=3000
```

**Note**: Replace `username`, `password`, and `product_feedback_db` with your actual PostgreSQL credentials and database name.

### 4. Database Setup

#### Create Database

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL (replace with your credentials)
psql -U postgres -h localhost

# Create database
CREATE DATABASE product_feedback_db;

# Exit PostgreSQL
\q
```

#### Run Migrations

Apply the database migrations:

```bash
npx prisma migrate dev
```

#### Generate Prisma Client

Generate the Prisma client:

```bash
npx prisma generate
```

#### Seed Database (Optional)

Populate the database with sample data:

```bash
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` 🚀

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **ProductRequest**: Feature requests with categories and status
- **Comment**: Nested comments and replies system

### Categories

- `FEATURE`
- `ENHANCEMENT`
- `BUG`

### Request Status

- `SUGGESTION`
- `PLANNED`
- `IN_PROGRESS`
- `LIVE`

## API Endpoints

### Authentication

- `POST /login` - User login

### Comments

- `GET /api-v1/comments/:productId` - Get comments for a product
- `POST /api-v1/comments` - Create new comment
- `PUT /api-v1/comments/:id` - Update comment
- `DELETE /api-v1/comments/:id` - Delete comment

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run Prisma Studio (Database GUI)
npx prisma studio

# Reset database and apply migrations
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Testing API Endpoints

You can use the included `request.http` file with VS Code REST Client extension to test the API endpoints.

## Database Management

### View Data

Use Prisma Studio to view and edit your data:

```bash
npx prisma studio
```

### Reset Database

To reset your database and reseed:

```bash
npx prisma migrate reset
```

### Create New Migration

After modifying the schema:

```bash
npx prisma migrate dev --name your-migration-name
```

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding script
│   └── migrations/       # Database migrations
├── src/
│   ├── controllers/      # Route handlers
│   ├── utils/           # Utility functions
│   ├── __tests__/       # Test files
│   ├── index.ts         # Application entry point
│   ├── server.ts        # Express server setup
│   └── router.ts        # Route definitions
├── request.http         # API testing file
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Frediflexta/product_feedback/issues) on GitHub.
