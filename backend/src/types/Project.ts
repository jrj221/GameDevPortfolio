export type {
  ProjectSummary,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../../shared/index";

/**
 * Sort-key sentinel for the single metadata row that represents a project
 * itself (as opposed to one of its contribution entries) within the shared
 * ProjectContributions table.
 */
export const PROJECT_META_SORT_KEY = "__PROJECT__";

/** The per-project metadata row stored alongside its contributions. */
export interface ProjectMeta {
  projectName: string;
  contributionId: string; // always PROJECT_META_SORT_KEY
  color: string;
  createdAt: string;
}
