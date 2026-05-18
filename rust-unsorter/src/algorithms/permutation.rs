use crate::trace::observer::StepObserver;

pub fn apply_index_order<T: Clone, O: StepObserver>(
    input: &[T],
    source_at_position: &[usize],
    observer: &mut O,
) -> Vec<T> {
    debug_assert_eq!(input.len(), source_at_position.len());

    let mut result = input.to_vec();
    let mut source_at_current_position: Vec<usize> = (0..input.len()).collect();
    let mut position_of_source: Vec<usize> = (0..input.len()).collect();

    for target_position in 0..source_at_position.len() {
        let wanted_source = source_at_position[target_position];
        let current_position = position_of_source[wanted_source];

        if current_position == target_position {
            continue;
        }

        result.swap(target_position, current_position);
        observer.swap(target_position, current_position);

        let displaced_source = source_at_current_position[target_position];
        source_at_current_position.swap(target_position, current_position);
        position_of_source[wanted_source] = target_position;
        position_of_source[displaced_source] = current_position;
    }

    result
}
