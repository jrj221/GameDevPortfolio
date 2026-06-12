/**
 * Contribution DTOs shared between the frontend and backend. The request
 * bodies (CreateContributionRequest, UpdateContributionRequest) live in
 * ./Request.
 */

import type { Response } from "./Response";

export interface Contribution extends Response {
  projectName: string;
  contributionId: string;
  timeSpentMinutes: number;
  description: string;
  createdAt: string;
}
