export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  dueDate?: Date | undefined | null;
  dueTime?: string | undefined | null;
  status: 'pending' | 'completed' | 'expired';
  viewDetails: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

export interface Categories {
  name: string;
  icon: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
}
