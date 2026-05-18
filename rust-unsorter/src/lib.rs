pub mod algorithms;
pub mod trace;

use algorithms::{
    bit_reversal::BitReversalUnsorter,
    derangement::DerangementUnsorter,
    faro::{FaroInUnsorter, FaroOutUnsorter},
    fisher_yates::FisherYatesUnsorter,
    inside_out::InsideOutUnsorter,
    mask::MaskUnsorter,
    recursive::RecursiveUnsorter,
    reverse::ReverseUnsorter,
    riffle::RiffleUnsorter,
    sattolo::SattoloUnsorter,
};
use trace::TraceResult;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum Algorithm {
    FisherYates,
    Sattolo,
    Reverse,
    FaroOut,
    FaroIn,
    BitReversal,
    Riffle,
    InsideOut,
    Derangement,
    Recursive,
    Mask,
}

#[wasm_bindgen]
pub fn unsort(input: &[i32], algorithm: Option<Algorithm>, seed: Option<f64>) -> Vec<i32> {
    let algo = algorithm.unwrap_or(Algorithm::FisherYates);
    let seed = seed.map(|s| s as u64);

    match algo {
        Algorithm::FisherYates => {
            if let Some(seed) = seed {
                FisherYatesUnsorter::unsort_seeded(input, seed)
            } else {
                FisherYatesUnsorter::unsort(input)
            }
        }
        Algorithm::Sattolo => {
            if let Some(seed) = seed {
                SattoloUnsorter::unsort_seeded(input, seed)
            } else {
                SattoloUnsorter::unsort(input)
            }
        }
        Algorithm::Reverse => ReverseUnsorter::unsort(input),
        Algorithm::FaroOut => FaroOutUnsorter::unsort(input),
        Algorithm::FaroIn => FaroInUnsorter::unsort(input),
        Algorithm::BitReversal => BitReversalUnsorter::unsort(input),
        Algorithm::Riffle => {
            if let Some(seed) = seed {
                RiffleUnsorter::unsort_seeded(input, seed)
            } else {
                RiffleUnsorter::unsort(input)
            }
        }
        Algorithm::InsideOut => {
            if let Some(seed) = seed {
                InsideOutUnsorter::unsort_seeded(input, seed)
            } else {
                InsideOutUnsorter::unsort(input)
            }
        }
        Algorithm::Derangement => {
            if let Some(seed) = seed {
                DerangementUnsorter::unsort_seeded(input, seed)
            } else {
                DerangementUnsorter::unsort(input)
            }
        }
        Algorithm::Recursive => RecursiveUnsorter::unsort(input),
        Algorithm::Mask => MaskUnsorter::unsort(input),
    }
}

#[wasm_bindgen]
pub fn unsort_steps(input: &[i32], algorithm: Option<Algorithm>, seed: Option<f64>) -> JsValue {
    let algo = algorithm.unwrap_or(Algorithm::FisherYates);
    let seed = seed.map(|s| s as u64);

    let mut steps = Vec::new();

    let result = match algo {
        Algorithm::FisherYates => {
            if let Some(seed) = seed {
                FisherYatesUnsorter::unsort_seeded_with_steps(input, seed, &mut steps)
            } else {
                FisherYatesUnsorter::unsort_with_steps(input, &mut steps)
            }
        }
        Algorithm::Sattolo => {
            if let Some(seed) = seed {
                SattoloUnsorter::unsort_seeded_with_steps(input, seed, &mut steps)
            } else {
                SattoloUnsorter::unsort_with_steps(input, &mut steps)
            }
        }
        Algorithm::Reverse => ReverseUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::FaroOut => FaroOutUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::FaroIn => FaroInUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::BitReversal => BitReversalUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::Riffle => {
            if let Some(seed) = seed {
                RiffleUnsorter::unsort_seeded_with_steps(input, seed, &mut steps)
            } else {
                RiffleUnsorter::unsort_with_steps(input, &mut steps)
            }
        }
        Algorithm::InsideOut => {
            if let Some(seed) = seed {
                InsideOutUnsorter::unsort_seeded_with_steps(input, seed, &mut steps)
            } else {
                InsideOutUnsorter::unsort_with_steps(input, &mut steps)
            }
        }
        Algorithm::Derangement => {
            if let Some(seed) = seed {
                DerangementUnsorter::unsort_seeded_with_steps(input, seed, &mut steps)
            } else {
                DerangementUnsorter::unsort_with_steps(input, &mut steps)
            }
        }
        Algorithm::Recursive => RecursiveUnsorter::unsort_with_steps(input, &mut steps),
        Algorithm::Mask => MaskUnsorter::unsort_with_steps(input, &mut steps),
    };

    serde_wasm_bindgen::to_value(&TraceResult { result, steps }).unwrap()
}
