use super::Unsorter;
use rand::prelude::*;

pub struct RandomUnsorter;

impl Unsorter for RandomUnsorter {
    fn unsort<T: Clone>(&self, input: &[T]) -> Vec<T> {
        let mut result = input.to_vec();
        let mut rng = rand::rng();

        result.shuffle(&mut rng);
        result
    }
}