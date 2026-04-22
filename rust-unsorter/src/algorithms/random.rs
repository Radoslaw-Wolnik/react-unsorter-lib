use crate::trace::{
    observer::{NoopObserver, RecordingObserver, StepObserver},
    Step,
};
use rand::{Rng, RngExt, SeedableRng, rngs::StdRng};

pub struct RandomUnsorter;

fn fisher_yates<T: Clone, R: Rng + ?Sized, O: StepObserver>(
    input: &[T],
    rng: &mut R,
    observer: &mut O,
) -> Vec<T> {
    let mut result = input.to_vec();

    if result.len() < 2 {
        return result;
    }

    for i in (1..result.len()).rev() {
        let j = rng.random_range(0..=i);
        result.swap(i, j);
        observer.swap(i, j);
    }

    result
}

impl RandomUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut rng = rand::rng();
        let mut observer = NoopObserver;
        fisher_yates(input, &mut rng, &mut observer)
    }

    pub fn unsort_seeded<T: Clone>(input: &[T], seed: u64) -> Vec<T> {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut observer = NoopObserver;
        fisher_yates(input, &mut rng, &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut rng = rand::rng();
        let mut observer = RecordingObserver { steps };
        fisher_yates(input, &mut rng, &mut observer)
    }

    pub fn unsort_seeded_with_steps<T: Clone>(
        input: &[T],
        seed: u64,
        steps: &mut Vec<Step>,
    ) -> Vec<T> {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut observer = RecordingObserver { steps };
        fisher_yates(input, &mut rng, &mut observer)
    }
}