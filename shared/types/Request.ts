/**
 * Base interface inherited by every request body sent to the API. It is empty
 * today, but giving all requests a common supertype lets shared networking
 * code constrain what it is allowed to send.
 */
export interface Request {}

/** Body for POST /projects. */
export interface CreateProjectRequest extends Request {
  projectName: string;
  color: string;
}

/** Body for PUT /projects/{projectName}. */
export interface UpdateProjectRequest extends Request {
  /** New name to rename the project to. Omit to keep the current name. */
  newName?: string;
  /** New color. Omit to keep the current color. */
  color?: string;
}

/**
 * Body for POST /contributions/{projectName}. The owning projectName is taken
 * from the URL, so it is not part of the request body.
 */
export interface CreateContributionRequest extends Request {
  timeSpentMinutes: number;
  description: string;
}

/** Body for PUT /contributions/{projectName}/{contributionId}. */
export interface UpdateContributionRequest extends CreateContributionRequest {}
