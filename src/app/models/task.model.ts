export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
