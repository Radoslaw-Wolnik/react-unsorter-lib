use crate::{
    algorithms::permutation::apply_index_order,
    trace::{
        Step,
        observer::{NoopObserver, RecordingObserver, StepObserver},
    },
};
use rand::{Rng, RngExt, SeedableRng, rngs::StdRng};

pub struct RiffleUnsorter;

fn riffle_order<R: Rng + ?Sized>(len: usize, rng: &mut R) -> Vec<usize> {
    let cut = (0..len).filter(|_| rng.random_bool(0.5)).count();
    let mut left = 0;
    let mut right = cut;
    let mut order = Vec::with_capacity(len);

    while left < cut || right < len {
        let left_remaining = cut - left;
        let right_remaining = len - right;
        let take_left = if left_remaining == 0 {
            false
        } else if right_remaining == 0 {
            true
        } else {
            rng.random_range(0..(left_remaining + right_remaining)) < left_remaining
        };

        if take_left {
            order.push(left);
            left += 1;
        } else {
            order.push(right);
            right += 1;
        }
    }

    order
}

fn unsort_impl<T: Clone, R: Rng + ?Sized, O: StepObserver>(
    input: &[T],
    rng: &mut R,
    observer: &mut O,
) -> Vec<T> {
    apply_index_order(input, &riffle_order(input.len(), rng), observer)
}

impl RiffleUnsorter {
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
