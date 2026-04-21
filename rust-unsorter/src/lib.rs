pub mod algorithms;
pub mod trace;

use wasm_bindgen::prelude::*;
use algorithms::{
    Unsorter,
    random::RandomUnsorter,
    last_first::LastFirstUnsorter,
    recursive::RecursiveUnsorter,
    mask::MaskUnsorter,
};

#[wasm_bindgen]
pub enum Algorithm {
    Random,
    LastFirst,
    Recursive,
    Mask,
}

#[wasm_bindgen]
pub fn unsort(
    input: &[i32],
    algorithm: Option<Algorithm>,
    seed: Option<f64>,
) -> Vec<i32> {
    let algo = algorithm.unwrap_or(Algorithm::Random);

   let seedu = match seed {
        Some(s) => Some(s as u64),
        None => None,
    };

    match algo {
        Algorithm::Random => {
            if let Some(seed) = seedu {
                seeded_random(input, seed)
            } else {
                RandomUnsorter.unsort(input)
            }
        }
        Algorithm::LastFirst => LastFirstUnsorter.unsort(input),
        Algorithm::Recursive => RecursiveUnsorter.unsort(input),
        Algorithm::Mask => MaskUnsorter.unsort(input),
    }
}

use rand::{SeedableRng};
use rand::rngs::StdRng;
use rand::seq::SliceRandom;

fn seeded_random<T: Clone>(input: &[T], seed: u64) -> Vec<T> {
    let mut rng = StdRng::seed_from_u64(seed);
    let mut result = input.to_vec();
    result.shuffle(&mut rng);
    result
}