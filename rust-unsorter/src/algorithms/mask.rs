use crate::trace::{
    observer::{NoopObserver, RecordingObserver, StepObserver},
    Step,
};
use rand::{RngExt};

pub struct MaskUnsorter;

fn unsort_impl<T: Clone, O: StepObserver>(input: &[T], observer: &mut O) -> Vec<T> {
    let mut result = input.to_vec();
    let n = result.len();

    let mut rng = rand::rng();
    let mask: u64 = rng.random();
    let mut seed = mask as u128;

    for i in (1..n).rev() {
        seed = seed.wrapping_mul(1103515245).wrapping_add(12345);
        let j = (seed % (i + 1) as u128) as usize;
        result.swap(i, j);
        observer.swap(i, j);
    }

    result
}

impl MaskUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut observer = NoopObserver;
        unsort_impl(input, &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut observer = RecordingObserver { steps };
        unsort_impl(input, &mut observer)
    }
}