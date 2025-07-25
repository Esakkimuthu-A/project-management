export interface Resource {
  id: string;
  name: string;
  email: string;
  status: string;
  cost: number;
  created_at: string;
}

export interface Task {
  id: string;
  task: string;
  startDate: string;
  endDate: string;
  status: string;
  created_at: string;
}