import type { Contribution, CreateContributionRequest } from "../../../shared/index";

export type { Contribution, CreateContributionRequest };

/** Service-layer input for creating a contribution (projectName comes from the path). */
export type CreateContributionInput = Omit<Contribution, "contributionId" | "createdAt">;
