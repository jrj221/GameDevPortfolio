import type {
  ProjectSummary,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/Project";

export interface IProjectRepository {
  /** Create the metadata row for a project and return its (empty) summary. */
  createProject(input: CreateProjectRequest): Promise<ProjectSummary>;
  /** List every project with its color and aggregate stats. */
  listProjects(): Promise<ProjectSummary[]>;
  /** Update a project's color and/or rename it (migrating all of its rows). */
  updateProject(projectName: string, input: UpdateProjectRequest): Promise<ProjectSummary>;
  /** Delete a project's metadata row and every one of its contributions. */
  deleteProject(projectName: string): Promise<void>;
}
