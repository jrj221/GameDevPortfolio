/**
 * Project DTOs shared between the frontend and backend. These describe the
 * wire shapes exchanged over the API; backend-only concerns (the DynamoDB
 * metadata row, sort-key sentinel) live in backend/src/types/Project.ts. The
 * request bodies (CreateProjectRequest, UpdateProjectRequest) live in
 * ./Request.
 */

import type { Response } from "./Response";

/** A project plus the aggregate stats used to render its card. */
export interface ProjectSummary extends Response {
  projectName: string;
  color: string;
  entryCount: number;
  totalMinutes: number;
  /** ISO timestamp the project's metadata row was first created. */
  createdAt: string;
}
