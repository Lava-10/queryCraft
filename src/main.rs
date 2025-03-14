// src/main.rs

mod mod_; `
use mod_::pipeline;
use std::env;
use serde_json::json;

fn main() {
    let args: Vec<String> = env::args().collect();
    let is_debug = args.contains(&"--debug".to_string());
    let query = args.last().expect("No query provided").clone();

    let mut db = crate::db::Database::new();

    if is_debug {
        // Tokenization stage
        let tokens = crate::tokenizer::tokenize(&query);
        println!("{}", json!({
            "stage": "tokenization",
            "data": {
                "tokens": tokens
            }
        }));

        // Parsing stage
        let ast = crate::parser::Parser::new(&query).parse_statement();
        println!("{}", json!({
            "stage": "parsing",
            "data": {
                "ast": ast
            }
        }));

        // Analysis stage
        let analysis_result = crate::analyzer::analyze(&ast, &mut db);
        println!("{}", json!({
            "stage": "analysis",
            "data": {
                "result": analysis_result
            }
        }));

        // Optimization stage
        let optimized_ast = crate::optimizer::optimize(&mut ast);
        println!("{}", json!({
            "stage": "optimization",
            "data": {
                "optimized_ast": optimized_ast
            }
        }));

        // Preparation stage
        let prepared_ast = crate::prepare::prepare(&mut ast, &mut db);
        println!("{}", json!({
            "stage": "preparation",
            "data": {
                "prepared_ast": prepared_ast
            }
        }));

        // Execution stage
        let start_time = std::time::Instant::now();
        let result = db.execute(&prepared_ast);
        let execution_time = start_time.elapsed().as_millis();
        
        println!("{}", json!({
            "stage": "execution",
            "data": {
                "result": result,
                "execution_time": execution_time
            }
        }));

        // Final result
        println!("{}", json!({
            "columns": result.columns,
            "rows": result.rows,
            "executionTime": execution_time
        }));
    } else {
        // Normal execution without debug output
        let start_time = std::time::Instant::now();
        let result = crate::pipeline(&query, &mut db);
        let execution_time = start_time.elapsed().as_millis();
        
        println!("{}", json!({
            "columns": result.columns,
            "rows": result.rows,
            "executionTime": execution_time
        }));
    }
}
