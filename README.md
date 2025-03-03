# queryCraft Engine

queryCraft is a lightweight, educational SQL engine written in Rust. It demonstrates the core components of a SQL processing pipeline—from tokenization and parsing to semantic analysis, query optimization, and final query preparation.

## Features

- **Custom Lexer & Tokenizer:**  
  Breaks down raw SQL strings into tokens (keywords, identifiers, numbers, strings, operators) with robust error handling for issues such as unclosed strings.

- **TDOP-Based Parser:**  
  Uses a Top-Down Operator Precedence (TDOP) recursive descent parser to convert tokens into an Abstract Syntax Tree (AST) for SQL statements and expressions, leveraging Rust’s enums and pattern matching.


- **Semantic Analysis:**  
  Validates SQL queries against simulated schema metadata, performing type checking and constraint verification to ensure query correctness.

- **Advanced Query Optimization:**  
  Implements AST transformations including constant folding and algebraic expression simplification to reduce computational overhead.

- **Dynamic Query Preparation:**  
  Expands wildcards (e.g., `SELECT *`), reorders `INSERT` statement columns based on table schema metadata, and integrates comprehensive semantic checks to ensure data consistency.

## Project Structure

- **mod.rs:**  
  The main entry point that integrates the entire SQL processing pipeline by linking the parser, analyzer, optimizer, and preparation stages.

- **token.rs:**  
  Defines the SQL tokens, including various keywords and operators, which are used by the tokenizer and parser.

- **tokenizer.rs:**  
  Implements the lexer that converts raw SQL input into a stream of tokens, handling whitespace, literals, and operator errors.

- **parser.rs:**  
  Converts the token stream into an AST using a recursive descent approach with TDOP, supporting multiple SQL statements (SELECT, INSERT, UPDATE, DELETE, etc.).

- **statement.rs:**  
  Contains the AST definitions for SQL queries, expressions, operators, and constraints.

- **analyzer.rs:**  
  Performs semantic analysis, ensuring that SQL statements comply with the expected schema and constraints before execution.

- **optimizer.rs:**  
  Optimizes queries by simplifying expressions, reducing redundant operations, and applying AST transformations for efficient execution.

- **prepare.rs:**  
  Finalizes SQL statements by expanding wildcards, reordering columns in INSERT statements, and applying final semantic adjustments before query execution.

## Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/) (latest stable version)

### Building the Project

Clone the repository and build using Cargo:

```bash
git clone https://github.com/yourusername/queryCraft.git
cd queryCraft
cargo build
