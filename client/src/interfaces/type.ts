interface User {
    userName: string;
    email: string;
    password: string;
}

interface AuthState {
  user: User[];
  error: string | null;
}

interface ProjectMember {
  userId: number;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  image?: string;
  members: ProjectMember[];
}

interface Task {
  id: string;
  taskName: string;
  assigneeId: string | number;
  projectId: string;
  asignDate: string;
  dueDate: string;
  priority: "Thấp" | "Trung bình" | "Cao";
  progress: "Đúng tiến độ" | "Có rủi ro" | "Trễ hạn";
  status: "To do" | "In Progress" | "Pending" | "Done";
}

export type { User, AuthState, Project, ProjectMember, Task };