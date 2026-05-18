pub mod bit_reversal;
pub mod derangement;
pub mod faro;
pub mod fisher_yates;
pub mod inside_out;
pub mod mask;
pub mod permutation;
pub mod recursive;
pub mod reverse;
pub mod riffle;
pub mod sattolo;

/// An `Unsorter` takes a slice and returns a new, unsorted `Vec<T>`.
pub trait Unsorter {
    fn unsort<T: Clone>(&self, input: &[T]) -> Vec<T>;
}
