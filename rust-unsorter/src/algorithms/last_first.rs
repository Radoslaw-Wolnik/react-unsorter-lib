use crate::trace::{
    observer::{NoopObserver, RecordingObserver, StepObserver},
    Step,
};

pub struct LastFirstUnsorter;

fn unsort_impl<T: Clone, O: StepObserver>(input: &[T], observer: &mut O) -> Vec<T> {
    let mut result = input.to_vec();
    let len = result.len();

    for i in 0..len / 2 {
        let j = len - 1 - i;
        result.swap(i, j);
        observer.swap(i, j);
    }

    result
}

impl LastFirstUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut observer = NoopObserver;
        unsort_impl(input, &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut observer = RecordingObserver { steps };
        unsort_impl(input, &mut observer)
    }
}