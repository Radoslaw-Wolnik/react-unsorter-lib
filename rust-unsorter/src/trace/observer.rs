use super::Step;

pub trait StepObserver {
    fn swap(&mut self, i: usize, j: usize);
}

#[derive(Default)]
pub struct NoopObserver;

impl StepObserver for NoopObserver {
    #[inline(always)]
    fn swap(&mut self, _i: usize, _j: usize) {}
}

pub struct RecordingObserver<'a> {
    pub steps: &'a mut Vec<Step>,
}

impl<'a> StepObserver for RecordingObserver<'a> {
    #[inline(always)]
    fn swap(&mut self, i: usize, j: usize) {
        self.steps.push(Step::swap(i, j));
    }
}