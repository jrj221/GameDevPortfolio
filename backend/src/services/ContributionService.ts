import type { IContributionRepository } from "../repositories/IContributionRepository";
import type { Contribution, CreateContributionInput } from "../types/Contribution";

export class ContributionService {
  constructor(private repository: IContributionRepository) {}

  async getContribution(projectName: string, contributionId: string): Promise<Contribution | null> {
    return this.repository.getById(projectName, contributionId);
  }

  async listContributions(projectName: string): Promise<Contribution[]> {
    return this.repository.listByProject(projectName);
  }

  async createContribution(input: CreateContributionInput): Promise<Contribution> {
    if (input.timeSpentMinutes <= 0) {
      throw new Error("timeSpentMinutes must be greater than 0");
    }
    if (!input.description.trim()) {
      throw new Error("description cannot be empty");
    }
    return this.repository.create(input);
  }

  async updateContribution(
    projectName: string,
    contributionId: string,
    input: Pick<CreateContributionInput, "timeSpentMinutes" | "description">
  ): Promise<Contribution> {
    if (input.timeSpentMinutes <= 0) {
      throw new Error("timeSpentMinutes must be greater than 0");
    }
    if (!input.description.trim()) {
      throw new Error("description cannot be empty");
    }
    const existing = await this.repository.getById(projectName, contributionId);
    if (!existing) {
      throw new Error(`Contribution ${contributionId} not found`);
    }
    return this.repository.update({
      ...existing,
      timeSpentMinutes: input.timeSpentMinutes,
      description: input.description,
    });
  }

  async deleteContribution(projectName: string, contributionId: string): Promise<void> {
    const existing = await this.repository.getById(projectName, contributionId);
    if (!existing) {
      throw new Error(`Contribution ${contributionId} not found`);
    }
    return this.repository.delete(projectName, contributionId);
  }
}
