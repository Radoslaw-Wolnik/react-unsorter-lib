use crate::trace::{
    observer::{NoopObserver, RecordingObserver, StepObserver},
    Step,
};
use rand::{Rng, RngExt};

pub struct RecursiveUnsorter;

// Helper now takes an `offset` parameter.
fn helper<T, R: Rng + ?Sized, O: StepObserver>(
    arr: &mut [T],
    offset: usize,        // <-- new: starting index of this slice in the original array
    rng: &mut R,
    observer: &mut O,
) {
    let n = arr.len();
    if n <= 1 {
        return;
    }

    let mid = n / 2;

    // Recurse on left and right halves, passing the appropriate offsets.
    helper(&mut arr[..mid], offset, rng, observer);
    helper(&mut arr[mid..], offset + mid, rng, observer);

    // Generate random local indices.
    let local_i = rng.random_range(0..mid);
    let local_j = mid + rng.random_range(0..(n - mid));

    // Perform the swap on the slice.
    arr.swap(local_i, local_j);   // Note: fixed typo `swop` → `swap`

    // Record the swap with global (absolute) indices.
    observer.swap(offset + local_i, offset + local_j);
}

fn unsort_impl<T: Clone, O: StepObserver>(input: &[T], observer: &mut O) -> Vec<T> {
    let mut result = input.to_vec();
    let mut rng = rand::rng();

    // Start with offset 0 for the whole array.
    helper(&mut result, 0, &mut rng, observer);
    result
}

impl RecursiveUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut observer = NoopObserver;
        unsort_impl(input, &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut observer = RecordingObserver { steps };
        unsort_impl(input, &mut observer)
    }
}