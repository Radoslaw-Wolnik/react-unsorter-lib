use super::Unsorter;
use rand::prelude::*;

pub struct MaskUnsorter;

impl Unsorter for MaskUnsorter {
    fn unsort<T: Clone>(&self, input: &[T]) -> Vec<T> {
        let mut result = input.to_vec();
        let n = result.len();

        let mut rng = rand::rng();
        let mask: u64 = rng.random();
        let mut seed = mask as u128;

        for i in (1..n).rev() {
            seed = seed
                .wrapping_mul(1103515245)
                .wrapping_add(12345);

            let j = (seed % (i + 1) as u128) as usize;
            result.swap(i, j);
        }

        result
    }
}