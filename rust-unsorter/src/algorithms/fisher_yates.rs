use crate::trace::{
    Step,
    observer::{NoopObserver, RecordingObserver, StepObserver},
};
use rand::{Rng, RngExt, SeedableRng, rngs::StdRng};

pub struct FisherYatesUnsorter;

fn unsort_impl<T: Clone, R: Rng + ?Sized, O: StepObserver>(
    input: &[T],
    rng: &mut R,
    observer: &mut O,
) -> Vec<T> {
    let mut result = input.to_vec();

    for i in (1..result.len()).rev() {
        let j = rng.random_range(0..=i);
        result.swap(i, j);
        observer.swap(i, j);
    }

    result
}

impl FisherYatesUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut rng = rand::rng();
        let mut observer = NoopObserver;
        unsort_impl(input, &mut rng, &mut observer)
    }

    pub fn unsort_seeded<T: Clone>(input: &[T], seed: u64) -> Vec<T> {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut observer = NoopObserver;
        unsort_impl(input, &mut rng, &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut rng = rand::rng();
        let mut observer = RecordingObserver { steps };
        unsort_impl(input, &mut rng, &mut observer)
    }

    pub fn unsort_seeded_with_steps<T: Clone>(
        input: &[T],
        seed: u64,
        steps: &mut Vec<Step>,
    ) -> Vec<T> {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut observer = RecordingObserver { steps };
        unsort_impl(input, &mut rng, &mut observer)
    }
}
