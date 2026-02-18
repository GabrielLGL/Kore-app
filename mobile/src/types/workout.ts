export interface SetInputData {
  weight: string
  reps: string
}

export interface ValidatedSetData {
  weight: number
  reps: number
  isPr: boolean
}

export interface LastPerformance {
  maxWeight: number
  avgReps: number
  setsCount: number
  date: Date
}
