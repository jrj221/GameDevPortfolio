import { randomUUID } from "crypto";
import type { IDatabase } from "../db/IDatabase";
import type { IContributionRepository } from "./IContributionRepository";
import type { Contribution, CreateContributionInput } from "../types/Contribution";
import { PROJECT_META_SORT_KEY } from "../types/Project";

export const TABLE_NAME = "ProjectContributions";

export class ContributionRepository implements IContributionRepository {
  constructor(private db: IDatabase) {}

  async getById(projectName: string, contributionId: string): Promise<Contribution | null> {
    const item = await this.db.getItem({
      tableName: TABLE_NAME,
      key: { projectName, contributionId },
    });
    return item ? (item as unknown as Contribution) : null;
  }

  async listByPartition(projectName: string): Promise<Contribution[]> {
    return this.listByProject(projectName);
  }

  async listByProject(projectName: string): Promise<Contribution[]> {
    const items = await this.db.query({
      tableName: TABLE_NAME,
      keyConditionExpression: "#pk = :projectName",
      expressionAttributeNames: { "#pk": "projectName" },
      expressionAttributeValues: { ":projectName": projectName },
    });
    // Exclude the project metadata row; callers only want contribution entries.
    return (items as unknown as Contribution[]).filter(
      (item) => item.contributionId !== PROJECT_META_SORT_KEY
    );
  }

  async create(input: CreateContributionInput): Promise<Contribution> {
    const contribution: Contribution = {
      ...input,
      contributionId: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.db.putItem({
      tableName: TABLE_NAME,
      item: contribution as unknown as Record<string, unknown>,
    });
    return contribution;
  }

  async update(contribution: Contribution): Promise<Contribution> {
    await this.db.putItem({
      tableName: TABLE_NAME,
      item: contribution as unknown as Record<string, unknown>,
    });
    return contribution;
  }

  async delete(projectName: string, contributionId: string): Promise<void> {
    await this.db.deleteItem({
      tableName: TABLE_NAME,
      key: { projectName, contributionId },
    });
  }
}
