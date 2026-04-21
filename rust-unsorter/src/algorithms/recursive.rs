use super::Unsorter;
use rand::prelude::*;

pub struct RecursiveUnsorter;

impl Unsorter for RecursiveUnsorter {
    fn unsort<T: Clone>(&self, input: &[T]) -> Vec<T> {
        let mut result = input.to_vec();
        let mut rng = rand::rng();

        fn helper<T>(arr: &mut [T], rng: &mut impl Rng) {
            let n = arr.len();
            if n <= 1 {
                return;
            }

            let mid = n / 2;

            helper(&mut arr[..mid], rng);
            helper(&mut arr[mid..], rng);

            let i = rng.random_range(0..mid);
            let j = mid + rng.random_range(0..(n - mid));

            arr.swap(i, j);
        }

        helper(&mut result, &mut rng);
        result
    }
}