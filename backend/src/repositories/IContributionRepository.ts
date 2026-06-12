import type { IRepository } from "./IRepository";
import type { Contribution, CreateContributionInput } from "../types/Contribution";

export interface IContributionRepository
  extends IRepository<Contribution, CreateContributionInput> {
  listByProject(projectName: string): Promise<Contribution[]>;
  update(contribution: Contribution): Promise<Contribution>;
}
