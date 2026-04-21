use super::Unsorter;

pub struct LastFirstUnsorter;

impl Unsorter for LastFirstUnsorter {
    fn unsort<T: Clone>(&self, input: &[T]) -> Vec<T> {
        let mut result = input.to_vec();
        let len = result.len();

        for i in 0..len / 2 {
            let j = len - 1 - i;
            result.swap(i, j);
        }

        result
    }
}