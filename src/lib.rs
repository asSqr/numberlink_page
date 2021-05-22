mod utils;
mod logic;

use wasm_bindgen::prelude::*;
use wasm_bindgen::{Clamped, JsCast};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! measure_elapsed_time {
    ($t:tt, $s:block) => {{
        let window = web_sys::window().expect("should have a window in this context");
        let performance = window
            .performance()
            .expect("performance should be available");
        let start = performance.now();
        let result = { $s };
        let end = performance.now();
        console_log!("{}:{} [ms]", $t, end - start);
        result
    }};
}

#[wasm_bindgen]
pub fn parse_url(
    url: String,
) -> String {
    measure_elapsed_time!("generate:wasm\telapsed:", {
        let opt = logic::parse_url(url);

        if let Some(field) = opt {
            return serde_json::to_string(&field).unwrap();
        } else {
            console_log!("Error!!!");

            return "".to_string();
        }
    })
}

#[wasm_bindgen]
pub fn solve_numberlink(
    url: String,
) -> String {
    measure_elapsed_time!("generate:wasm\telapsed:", {
        let opt = logic::solve(url);

        if let Some((field, sol)) = opt {
            return serde_json::to_string(&sol).unwrap();
        } else {
            console_log!("Error!!!");

            return "".to_string();
        }
    })
}