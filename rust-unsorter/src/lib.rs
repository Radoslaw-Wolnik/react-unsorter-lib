pub mod algorithms;
pub mod trace;

use algorithms::{
    last_first::LastFirstUnsorter,
    mask::MaskUnsorter,
    random::RandomUnsorter,
    recursive::RecursiveUnsorter,
};
use trace::TraceResult;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum Algorithm {
    Random,
    LastFirst,
    Recursive,
    Mask,
}

#[wasm_bindgen]
pub fn unsort(input: &[i32], algorithm: Option<Algorithm>, seed: Option<f64>) -> Vec<i32> {
    let algo = algorithm.unwrap_or(Algorithm::Random);
    let seed = seed.map(|s| s as u64);

    match algo {
        Algorithm::Random => {
            if let Some(seed) = seed {
                RandomUnsorter::unsort_seeded(input, seed)
            } else {
                RandomUnsorter::unsort(input)
            }
        }
        Algorithm::LastFirst => LastFirstUnsorter::unsort(input),
        Algorithm::Recursive => RecursiveUnsorter::unsort(input),
        Algorithm::Mask => MaskUnsorter::unsort(input),
    }
}

#[wasm_bindgen]
pub fn unsort_steps(
    input: &[i32],
    algorithm: Option<Algorithm>,
    seed: Option<f64>,
) -> JsValue {
    let algo = algorithm.unwrap_or(Algorithm::Random);
    let seed = seed.map(|s| s as u64);

    let mut steps = Vec::new();

    let result = match algo {
        Algorithm::Random => {
            if let Some(seed) = seed {
                RandomUnsorter::unsort_seeded_with_steps(input, seed, &mut steps)
            } else {
                RandomUnsorter::unsort_with_steps(input, &mut steps)
            }
        }
        Algorithm::LastFirst => LastFirstUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::Recursive => RecursiveUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::Mask => MaskUnsorter::unsort_with_steps(input, &mut steps),
    };

    serde_wasm_bindgen::to_value(&TraceResult { result, steps }).unwrap()
}