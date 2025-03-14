# QueryCraft - SQL Query Engine with Visualization

A powerful SQL query engine built in Rust with a modern React frontend and Node.js backend. QueryCraft provides real-time query execution, visualization of the query execution pipeline, query history management, and performance analytics.

## Problem We're Solving

SQL databases are often "black boxes" to users who write queries. When a query runs, what actually happens behind the scenes remains hidden, making it difficult for developers and database users to understand:

- Why is my query slow?
- How is the database interpreting my SQL statement?
- What transformations happen before execution?
- How is the query optimized?

QueryCraft solves this problem by **visualizing the entire SQL query execution pipeline**, from tokenization to final execution. This transparency allows users to:

1. See how their SQL is tokenized and parsed into an abstract syntax tree
2. Understand how semantic analysis validates their query
3. Observe optimization steps applied to improve performance
4. View the actual execution plan and results
5. Compare performance metrics across different query formulations

This visualization approach transforms SQL query writing from a trial-and-error process into an educational experience that improves query writing skills and understanding of database operations.

## Features

### Core SQL Engine
- SQL query parsing and execution
- Support for SELECT, INSERT, UPDATE, DELETE operations
- Query optimization and execution pipeline visualization
- Real-time query results display

### Query Execution Pipeline Visualization
- **Tokenization:** See how your SQL is broken into tokens (keywords, identifiers, etc.)
- **Parsing:** View the abstract syntax tree (AST) built from your query
- **Analysis:** Understand semantic checks performed on your query
- **Optimization:** Observe transformations like constant folding and expression simplification
- **Preparation:** See wildcard expansion, column reordering, and final query preparation
- **Execution:** View the execution plan and actual results

### Query History
- Automatic tracking of executed queries
- Favorite queries management
- Search functionality for past queries
- Quick re-execution of historical queries
- Query execution time tracking

### Analytics Dashboard
- Total query count and average execution time
- Query type distribution (SELECT, INSERT, UPDATE, DELETE)
- Performance trends over time
- Slowest queries identification
- Visual representation of query statistics

## Project Structure (Might change based on the features that will be added)

```
queryCraft/
├── src/                    # Rust SQL Engine
│   ├── main.rs            # Main entry point
│   ├── lexer.rs           # SQL tokenization
│   ├── parser.rs          # SQL parsing
│   ├── analyzer.rs        # Query analysis
│   ├── optimizer.rs       # Query optimization
│   ├── executor.rs        # Query execution
│   └── types.rs           # Common types
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SQLEditor.tsx      # SQL query editor
│   │   │   ├── QueryHistory.tsx   # Query history component
│   │   │   └── Dashboard.tsx      # Analytics dashboard
│   │   └── App.tsx
│   └── package.json
├── backend/               # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── queryController.js    # Query execution
│   │   │   ├── historyController.js  # Query history management
│   │   │   └── analyticsController.js # Analytics data
│   │   ├── routes/
│   │   │   ├── queryRoutes.js
│   │   │   ├── historyRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   └── server.js
│   └── package.json
└── Cargo.toml            # Rust dependencies
```

## Getting Started

### Prerequisites
- Rust (latest stable version)
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
cd queryCraft
```

2. Build the Rust engine:
```bash
cargo build
```

3. Set up the MySQL database:
```bash
mysql -u your_username -p your_database < backend/src/db/schema.sql
```

4. Configure environment variables:
Create a `.env` file in the backend directory:
```
PORT=3001
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

5. Install backend dependencies:
```bash
cd backend
npm install
```

6. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Query Execution
- `POST /api/query` - Execute a SQL query

### Query History
- `GET /api/history` - Get query history
- `POST /api/history` - Add query to history
- `PATCH /api/history/:id/favorite` - Toggle favorite status
- `DELETE /api/history/:id` - Delete query from history


