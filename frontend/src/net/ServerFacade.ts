import type {
	IServerFacade,
	Contribution,
	ProjectSummary,
	MessageResponse,
	CreateProjectRequest,
	UpdateProjectRequest,
	CreateContributionRequest,
	UpdateContributionRequest,
} from "./IServerFacade";

import { clientCommunicator } from "./ClientCommunicator";

/**
 * Translates domain calls into the typed request bodies the API expects,
 * hands them to the ClientCommunicator (which knows only the HTTP verb and the
 * base Request/Response shapes), then casts the generic Response back into the
 * concrete response object each caller needs.
 */
export class ServerFacade implements IServerFacade {
	async listProjects(): Promise<ProjectSummary[]> {
		const projects = await clientCommunicator.get("/projects");
		return projects as ProjectSummary[];
	}

	async createProject(input: CreateProjectRequest): Promise<ProjectSummary> {
		const created = await clientCommunicator.post("/projects", input);
		return created as ProjectSummary;
	}

	async updateProject(projectName: string, input: UpdateProjectRequest): Promise<ProjectSummary> {
		const updated = await clientCommunicator.put(`/projects/${encodeURIComponent(projectName)}`, input);
		return updated as ProjectSummary;
	}

	async deleteProject(projectName: string): Promise<MessageResponse> {
		const result = await clientCommunicator.delete(`/projects/${encodeURIComponent(projectName)}`);
		return result as MessageResponse;
	}

	async listContributions(projectName: string): Promise<Contribution[]> {
		const contributions = await clientCommunicator.get(`/contributions/${encodeURIComponent(projectName)}`);
		return contributions as Contribution[];
	}

	async createContribution(projectName: string, input: CreateContributionRequest): Promise<Contribution> {
		const created = await clientCommunicator.post(`/contributions/${encodeURIComponent(projectName)}`, input);
		return created as Contribution;
	}

	async updateContribution(
		projectName: string,
		contributionId: string,
		input: UpdateContributionRequest,
	): Promise<Contribution> {
		const updated = await clientCommunicator.put(
			`/contributions/${encodeURIComponent(projectName)}/${contributionId}`,
			input,
		);
		return updated as Contribution;
	}

	async deleteContribution(projectName: string, contributionId: string): Promise<MessageResponse> {
		const result = await clientCommunicator.delete(
			`/contributions/${encodeURIComponent(projectName)}/${contributionId}`,
		);
		return result as MessageResponse;
	}
}

export const serverFacade: IServerFacade = new ServerFacade();
