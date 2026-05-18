use crate::{
    algorithms::permutation::apply_index_order,
    trace::{
        Step,
        observer::{NoopObserver, RecordingObserver},
    },
};

pub struct FaroOutUnsorter;
pub struct FaroInUnsorter;

fn out_order(len: usize) -> Vec<usize> {
    let split = len.div_ceil(2);
    let mut order = Vec::with_capacity(len);

    for i in 0..split {
        order.push(i);
        if split + i < len {
            order.push(split + i);
        }
    }

    order
}

fn in_order(len: usize) -> Vec<usize> {
    let split = len / 2;
    let mut order = Vec::with_capacity(len);

    for i in 0..(len - split) {
        order.push(split + i);
        if i < split {
            order.push(i);
        }
    }

    order
}

impl FaroOutUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut observer = NoopObserver;
        apply_index_order(input, &out_order(input.len()), &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut observer = RecordingObserver { steps };
        apply_index_order(input, &out_order(input.len()), &mut observer)
    }
}

impl FaroInUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut observer = NoopObserver;
        apply_index_order(input, &in_order(input.len()), &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut observer = RecordingObserver { steps };
        apply_index_order(input, &in_order(input.len()), &mut observer)
    }
}
