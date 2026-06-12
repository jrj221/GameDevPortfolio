import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DatabaseFactory } from "../db/DatabaseFactory";
import { ContributionRepository } from "../repositories/ContributionRepository";
import { ContributionService } from "../services/ContributionService";
import type { CreateContributionInput, CreateContributionRequest } from "../types/Contribution";

const db = DatabaseFactory.create(
  (process.env["DB_DRIVER"] as "dynamo" | undefined) ?? "dynamo"
);
const repository = new ContributionRepository(db);
const service = new ContributionService(repository);

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

// GET /contributions/{projectName}
export async function listContributions(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const projectName = event.pathParameters?.["projectName"];
  if (!projectName) {
    return response(400, { error: "projectName path parameter is required" });
  }
  try {
    const contributions = await service.listContributions(decodeURIComponent(projectName));
    return response(200, contributions);
  } catch (err) {
    console.error(err);
    return response(500, { error: "Internal server error" });
  }
}

// POST /contributions/{projectName}
export async function createContribution(
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
    const body = JSON.parse(event.body) as Partial<CreateContributionRequest>;
    const input: CreateContributionInput = {
      projectName: decodeURIComponent(projectName),
      timeSpentMinutes: body.timeSpentMinutes ?? 0,
      description: body.description ?? "",
    };
    const created = await service.createContribution(input);
    return response(201, created);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = err instanceof Error && message !== "Internal server error" ? 400 : 500;
    return response(status, { error: message });
  }
}

// PUT /contributions/{projectName}/{contributionId}
export async function updateContribution(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const projectName = event.pathParameters?.["projectName"];
  const contributionId = event.pathParameters?.["contributionId"];
  if (!projectName || !contributionId) {
    return response(400, { error: "projectName and contributionId path parameters are required" });
  }
  if (!event.body) {
    return response(400, { error: "Request body is required" });
  }
  try {
    const body = JSON.parse(event.body) as Partial<CreateContributionRequest>;
    const updated = await service.updateContribution(
      decodeURIComponent(projectName),
      contributionId,
      {
        timeSpentMinutes: body.timeSpentMinutes ?? 0,
        description: body.description ?? "",
      }
    );
    return response(200, updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("not found")
      ? 404
      : message !== "Internal server error"
        ? 400
        : 500;
    return response(status, { error: message });
  }
}

// DELETE /contributions/{projectName}/{contributionId}
export async function deleteContribution(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const projectName = event.pathParameters?.["projectName"];
  const contributionId = event.pathParameters?.["contributionId"];
  if (!projectName || !contributionId) {
    return response(400, { error: "projectName and contributionId path parameters are required" });
  }
  try {
    await service.deleteContribution(decodeURIComponent(projectName), contributionId);
    return response(200, { message: "Deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return response(status, { error: message });
  }
}
