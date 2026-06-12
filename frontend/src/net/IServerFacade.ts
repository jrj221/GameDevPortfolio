import type {
  Contribution,
  ProjectSummary,
  MessageResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateContributionRequest,
  UpdateContributionRequest,
} from "../../../shared/index";

export type {
  Contribution,
  ProjectSummary,
  MessageResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateContributionRequest,
  UpdateContributionRequest,
};

export interface IServerFacade {
  listProjects(): Promise<ProjectSummary[]>;
  createProject(input: CreateProjectRequest): Promise<ProjectSummary>;
  updateProject(projectName: string, input: UpdateProjectRequest): Promise<ProjectSummary>;
  deleteProject(projectName: string): Promise<MessageResponse>;
  listContributions(projectName: string): Promise<Contribution[]>;
  createContribution(projectName: string, input: CreateContributionRequest): Promise<Contribution>;
  updateContribution(
    projectName: string,
    contributionId: string,
    input: UpdateContributionRequest
  ): Promise<Contribution>;
  deleteContribution(projectName: string, contributionId: string): Promise<MessageResponse>;
}
