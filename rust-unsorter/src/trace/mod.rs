use serde::Serialize;

pub mod observer;

#[derive(Clone, Copy, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum StepKind {
    Swap,
}

#[derive(Clone, Copy, Debug, Serialize)]
pub struct Step {
    pub kind: StepKind,
    pub i: usize,
    pub j: usize,
}

#[derive(Debug, Serialize)]
pub struct TraceResult {
    pub result: Vec<i32>,
    pub steps: Vec<Step>,
}

impl Step {
    pub fn swap(i: usize, j: usize) -> Self {
        Self {
            kind: StepKind::Swap,
            i,
            j,
        }
    }
}