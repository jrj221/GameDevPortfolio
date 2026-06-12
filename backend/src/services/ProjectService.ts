import type { IProjectRepository } from "../repositories/IProjectRepository";
import type {
  ProjectSummary,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/Project";

export class ProjectService {
  constructor(private repository: IProjectRepository) {}

  async listProjects(): Promise<ProjectSummary[]> {
    return this.repository.listProjects();
  }

  async createProject(input: CreateProjectRequest): Promise<ProjectSummary> {
    if (!input.projectName.trim()) {
      throw new Error("projectName cannot be empty");
    }
    if (!input.color.trim()) {
      throw new Error("color cannot be empty");
    }
    return this.repository.createProject(input);
  }

  async updateProject(projectName: string, input: UpdateProjectRequest): Promise<ProjectSummary> {
    if (input.newName !== undefined && !input.newName.trim()) {
      throw new Error("newName cannot be empty");
    }
    if (input.color !== undefined && !input.color.trim()) {
      throw new Error("color cannot be empty");
    }
    return this.repository.updateProject(projectName, input);
  }

  async deleteProject(projectName: string): Promise<void> {
    return this.repository.deleteProject(projectName);
  }
}
