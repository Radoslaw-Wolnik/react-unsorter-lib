use crate::{
    algorithms::permutation::apply_index_order,
    trace::{
        Step,
        observer::{NoopObserver, RecordingObserver, StepObserver},
    },
};
use rand::{Rng, RngExt, SeedableRng, rngs::StdRng};

pub struct DerangementUnsorter;

fn fisher_yates_indices<R: Rng + ?Sized>(len: usize, rng: &mut R) -> Vec<usize> {
    let mut order: Vec<usize> = (0..len).collect();

    for i in (1..len).rev() {
        let j = rng.random_range(0..=i);
        order.swap(i, j);
    }

    order
}

fn derangement_order<R: Rng + ?Sized>(len: usize, rng: &mut R) -> Vec<usize> {
    if len < 2 {
        return (0..len).collect();
    }

    loop {
        let order = fisher_yates_indices(len, rng);
        if order
            .iter()
            .enumerate()
            .all(|(position, source)| position != *source)
        {
            return order;
        }
    }
}

fn unsort_impl<T: Clone, R: Rng + ?Sized, O: StepObserver>(
    input: &[T],
    rng: &mut R,
    observer: &mut O,
) -> Vec<T> {
    apply_index_order(input, &derangement_order(input.len(), rng), observer)
}

impl DerangementUnsorter {
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
