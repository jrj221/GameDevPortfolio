import type { IDatabase } from "../db/IDatabase";
import type { IProjectRepository } from "./IProjectRepository";
import {
  PROJECT_META_SORT_KEY,
  type ProjectMeta,
  type ProjectSummary,
  type CreateProjectRequest,
  type UpdateProjectRequest,
} from "../types/Project";
import { TABLE_NAME } from "./ContributionRepository";

interface RawRow {
  projectName: string;
  contributionId: string;
  color?: string;
  timeSpentMinutes?: number;
  [key: string]: unknown;
}

export class ProjectRepository implements IProjectRepository {
  constructor(private db: IDatabase) {}

  async createProject(input: CreateProjectRequest): Promise<ProjectSummary> {
    const meta: ProjectMeta = {
      projectName: input.projectName,
      contributionId: PROJECT_META_SORT_KEY,
      color: input.color,
      createdAt: new Date().toISOString(),
    };
    await this.db.putItem({
      tableName: TABLE_NAME,
      item: meta as unknown as Record<string, unknown>,
    });
    // A brand-new project has no contributions yet.
    return {
      projectName: meta.projectName,
      color: meta.color,
      entryCount: 0,
      totalMinutes: 0,
      createdAt: meta.createdAt,
    };
  }

  async listProjects(): Promise<ProjectSummary[]> {
    const rows = (await this.db.scan({ tableName: TABLE_NAME })) as unknown as RawRow[];

    // Group rows by project: the metadata row carries the color, contribution
    // rows carry time. A project shows up if it has either.
    const byName = new Map<string, ProjectSummary>();
    const ensure = (projectName: string): ProjectSummary => {
      let summary = byName.get(projectName);
      if (!summary) {
        summary = { projectName, color: "", entryCount: 0, totalMinutes: 0, createdAt: "" };
        byName.set(projectName, summary);
      }
      return summary;
    };

    for (const row of rows) {
      const summary = ensure(row.projectName);
      if (row.contributionId === PROJECT_META_SORT_KEY) {
        summary.color = row.color ?? "";
        summary.createdAt = (row["createdAt"] as string | undefined) ?? "";
      } else {
        summary.entryCount += 1;
        summary.totalMinutes += row.timeSpentMinutes ?? 0;
      }
    }

    return [...byName.values()];
  }

  async updateProject(projectName: string, input: UpdateProjectRequest): Promise<ProjectSummary> {
    const rows = await this.listRows(projectName);
    const targetName = input.newName?.trim() || projectName;
    const renaming = targetName !== projectName;

    const existingMeta = rows.find((r) => r.contributionId === PROJECT_META_SORT_KEY);
    const color = input.color ?? existingMeta?.color ?? "";
    const createdAt = (existingMeta?.["createdAt"] as string | undefined) ?? new Date().toISOString();

    if (!renaming) {
      // Color-only change: upsert the metadata row, preserving createdAt.
      const meta: ProjectMeta = { projectName, contributionId: PROJECT_META_SORT_KEY, color, createdAt };
      await this.putRow(meta as unknown as RawRow);
      const merged = existingMeta
        ? rows.map((r) => (r.contributionId === PROJECT_META_SORT_KEY ? { ...r, color } : r))
        : [...rows, meta as unknown as RawRow];
      return this.summarize(projectName, merged);
    }

    // Renaming changes the partition key, so every row must be rewritten under
    // the new name and the old rows deleted.
    const collision = await this.listRows(targetName);
    if (collision.length > 0) {
      throw new Error(`A project named "${targetName}" already exists`);
    }

    const migrated: RawRow[] = [];
    for (const row of rows) {
      const moved: RawRow = { ...row, projectName: targetName };
      if (row.contributionId === PROJECT_META_SORT_KEY) moved.color = color;
      await this.putRow(moved);
      migrated.push(moved);
    }
    if (!existingMeta) {
      const meta: ProjectMeta = { projectName: targetName, contributionId: PROJECT_META_SORT_KEY, color, createdAt };
      await this.putRow(meta as unknown as RawRow);
      migrated.push(meta as unknown as RawRow);
    }
    for (const row of rows) {
      await this.db.deleteItem({
        tableName: TABLE_NAME,
        key: { projectName, contributionId: row.contributionId },
      });
    }
    return this.summarize(targetName, migrated);
  }

  async deleteProject(projectName: string): Promise<void> {
    const rows = await this.listRows(projectName);
    for (const row of rows) {
      await this.db.deleteItem({
        tableName: TABLE_NAME,
        key: { projectName, contributionId: row.contributionId },
      });
    }
  }

  private async listRows(projectName: string): Promise<RawRow[]> {
    return (await this.db.query({
      tableName: TABLE_NAME,
      keyConditionExpression: "#pk = :projectName",
      expressionAttributeNames: { "#pk": "projectName" },
      expressionAttributeValues: { ":projectName": projectName },
    })) as unknown as RawRow[];
  }

  private async putRow(row: RawRow): Promise<void> {
    await this.db.putItem({
      tableName: TABLE_NAME,
      item: row as unknown as Record<string, unknown>,
    });
  }

  private summarize(projectName: string, rows: RawRow[]): ProjectSummary {
    let color = "";
    let createdAt = "";
    let entryCount = 0;
    let totalMinutes = 0;
    for (const row of rows) {
      if (row.contributionId === PROJECT_META_SORT_KEY) {
        color = row.color ?? "";
        createdAt = (row["createdAt"] as string | undefined) ?? "";
      } else {
        entryCount += 1;
        totalMinutes += row.timeSpentMinutes ?? 0;
      }
    }
    return { projectName, color, entryCount, totalMinutes, createdAt };
  }
}
