pub mod last_first;
pub mod mask;
pub mod random;
pub mod recursive;

/// An `Unsorter` takes a slice and returns a new, unsorted `Vec<T>`.
pub trait Unsorter {
    fn unsort<T: Clone>(&self, input: &[T]) -> Vec<T>;
}