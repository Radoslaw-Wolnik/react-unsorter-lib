use crate::{
    algorithms::permutation::apply_index_order,
    trace::{
        Step,
        observer::{NoopObserver, RecordingObserver},
    },
};

pub struct BitReversalUnsorter;

fn reverse_low_bits(mut value: usize, bits: u32) -> usize {
    let mut reversed = 0;

    for _ in 0..bits {
        reversed = (reversed << 1) | (value & 1);
        value >>= 1;
    }

    reversed
}

fn bit_reversal_order(len: usize) -> Vec<usize> {
    if len < 2 {
        return (0..len).collect();
    }

    let bits = usize::BITS - (len - 1).leading_zeros();
    let mut keyed: Vec<(usize, usize)> = (0..len)
        .map(|index| (reverse_low_bits(index, bits), index))
        .collect();

    keyed.sort_by_key(|(key, _)| *key);
    keyed.into_iter().map(|(_, index)| index).collect()
}

impl BitReversalUnsorter {
    pub fn unsort<T: Clone>(input: &[T]) -> Vec<T> {
        let mut observer = NoopObserver;
        apply_index_order(input, &bit_reversal_order(input.len()), &mut observer)
    }

    pub fn unsort_with_steps<T: Clone>(input: &[T], steps: &mut Vec<Step>) -> Vec<T> {
        let mut observer = RecordingObserver { steps };
        apply_index_order(input, &bit_reversal_order(input.len()), &mut observer)
    }
}
