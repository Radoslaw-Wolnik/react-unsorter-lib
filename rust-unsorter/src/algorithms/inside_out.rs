use crate::{
    algorithms::permutation::apply_index_order,
    trace::{
        Step,
        observer::{NoopObserver, RecordingObserver, StepObserver},
    },
};
use rand::{Rng, RngExt, SeedableRng, rngs::StdRng};

pub struct InsideOutUnsorter;

fn inside_out_order<R: Rng + ?Sized>(len: usize, rng: &mut R) -> Vec<usize> {
    let mut order = Vec::with_capacity(len);

    for index in 0..len {
        let target = rng.random_range(0..=index);
        if target == index {
            order.push(index);
        } else {
            order.push(order[target]);
            order[target] = index;
        }
    }

    order
}

fn unsort_impl<T: Clone, R: Rng + ?Sized, O: StepObserver>(
    input: &[T],
    rng: &mut R,
    observer: &mut O,
) -> Vec<T> {
    apply_index_order(input, &inside_out_order(input.len(), rng), observer)
}

impl InsideOutUnsorter {
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
