import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DatabaseFactory } from "../db/DatabaseFactory";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { ProjectService } from "../services/ProjectService";
import type { CreateProjectRequest, UpdateProjectRequest } from "../types/Project";

const db = DatabaseFactory.create(
  (process.env["DB_DRIVER"] as "dynamo" | undefined) ?? "dynamo"
);
const repository = new ProjectRepository(db);
const service = new ProjectService(repository);

function response(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

// GET /projects
export async function listProjects(): Promise<APIGatewayProxyResult> {
  try {
    const projects = await service.listProjects();
    return response(200, projects);
  } catch (err) {
    console.error(err);
    return response(500, { error: "Internal server error" });
  }
}

// POST /projects
export async function createProject(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return response(400, { error: "Request body is required" });
  }
  try {
    const body = JSON.parse(event.body) as Partial<CreateProjectRequest>;
    const input: CreateProjectRequest = {
      projectName: body.projectName ?? "",
      color: body.color ?? "",
    };
    const created = await service.createProject(input);
    return response(201, created);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = err instanceof Error && message !== "Internal server error" ? 400 : 500;
    return response(status, { error: message });
  }
}

// PUT /projects/{projectName}
export async function updateProject(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const projectName = event.pathParameters?.["projectName"];
  if (!projectName) {
    return response(400, { error: "projectName path parameter is required" });
  }
  if (!event.body) {
    return response(400, { error: "Request body is required" });
  }
  try {
    const body = JSON.parse(event.body) as UpdateProjectRequest;
    const updated = await service.updateProject(decodeURIComponent(projectName), {
      newName: body.newName,
      color: body.color,
    });
    return response(200, updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("already exists")
      ? 409
      : message !== "Internal server error"
        ? 400
        : 500;
    return response(status, { error: message });
  }
}

// DELETE /projects/{projectName}
export async function deleteProject(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const projectName = event.pathParameters?.["projectName"];
  if (!projectName) {
    return response(400, { error: "projectName path parameter is required" });
  }
  try {
    await service.deleteProject(decodeURIComponent(projectName));
    return response(200, { message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return response(500, { error: "Internal server error" });
  }
}
