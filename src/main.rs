// src/main.rs

mod mod_; `
use mod_::pipeline;

fn main() {
    let sql = "SELECT * FROM dummy_table;";
    match pipeline(sql) {
        Ok(statement) => println!("Parsed statement: {:?}", statement),
        Err(e) => println!("Error: {:?}", e),
    }
}
