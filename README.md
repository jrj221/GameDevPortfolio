# GameDevPortfolio

Personal portfolio site with a React frontend deployed to S3 and a serverless backend on AWS Lambda + DynamoDB.

```
GameDevPortfolio/
  frontend/   React + Vite site
  backend/    AWS Lambda functions + SAM template
```

---

## Prerequisites

- Node.js 22+
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configured (`aws configure`)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) (`brew install aws-sam-cli`)

---

## Frontend

### Local development

```bash
cd frontend
npm install
npm start        # starts Vite dev server at http://localhost:5173
```

The frontend reads `VITE_API_BASE_URL` from `frontend/.env` to know where to send API requests.
Leave it empty while developing locally if you don't need live data, or point it at the deployed API.

### Deploy to S3

```bash
cd frontend
npm run deploy   # builds the site and uploads to S3 via BucketUpload.ts
```

After deploying the backend for the first time, paste the API Gateway URL into `frontend/.env`:

```
VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

Then redeploy the frontend so the new URL is baked into the build.

---

## Backend

All backend work lives in `backend/`. The entry point for every Lambda is `backend/src/handlers/contributions.ts`.
**Edit that file (and the service/repository layers below it) instead of editing Lambda functions directly in the AWS console.**
SAM handles bundling and deploying your local code to AWS.

### First-time setup

```bash
cd backend
npm install
```

### Deploy to AWS (first time or after infrastructure changes)

```bash
cd backend
sam build
sam deploy --guided
```

`--guided` walks you through a setup wizard and saves your answers to `samconfig.toml` so future deploys don't need it.
At the end of the deploy, SAM prints the `ApiBaseUrl` output — copy that into `frontend/.env`.

### Redeploy after editing handler code

```bash
cd backend
sam build && sam deploy
```

That's it. SAM bundles your TypeScript with esbuild, zips it, and updates the Lambda functions in place.
No need to touch the AWS console.

### Test locally with SAM

You can invoke a Lambda locally without deploying:

```bash
cd backend
sam build
sam local invoke ListContributionsFunction --event events/list-contributions.json
```

Or start a local API Gateway:

```bash
sam local start-api
# API is now available at http://localhost:3000
```

---

## Architecture

```
React component
  → serverFacade (frontend/src/services/ServerFacade.ts)
    → API Gateway (HTTPS)
      → Lambda handler (backend/src/handlers/contributions.ts)
        → ContributionService (backend/src/services/)
          → ContributionRepository (backend/src/repositories/)
            → DynamoDBDatabase (backend/src/db/)
              → DynamoDB table: ProjectContributions
```

### DynamoDB table schema

**Table:** `ProjectContributions`
| Attribute | Type | Role |
|---|---|---|
| `projectName` | String | Partition key |
| `contributionId` | String (UUID) | Sort key |
| `timeSpentMinutes` | Number | |
| `description` | String | |
| `createdAt` | String (ISO 8601) | |

Query all entries for a project: `projectName = "Building Busters"` — returns all contributions sorted by `contributionId`.

### Adding a new table / domain object

1. Add a type to `backend/src/types/` (e.g. `Skill.ts`)
2. Add a repository interface to `backend/src/repositories/` extending `IRepository`
3. Implement the repository using `IDatabase` (same pattern as `ContributionRepository.ts`)
4. Add a service in `backend/src/services/`
5. Add a handler file in `backend/src/handlers/`
6. Add the new DynamoDB table and Lambda functions to `backend/template.yaml`
7. Add the new facade methods to `frontend/src/services/IServerFacade.ts` and `ServerFacade.ts`

The `IDatabase` / `DatabaseFactory` layer does not need to change.

### Swapping the database

1. Implement `IDatabase` in a new class (e.g. `PostgresDatabase.ts`)
2. Add a new case to `DatabaseFactory.ts`
3. Set `DB_DRIVER=postgres` (or whatever you name it) in the Lambda environment variables in `template.yaml`

Nothing above the repository layer changes.

---

## API routes

| Method | Path | Handler export |
|---|---|---|
| GET | `/contributions/{projectName}` | `listContributions` |
| POST | `/contributions/{projectName}` | `createContribution` |
| DELETE | `/contributions/{projectName}/{contributionId}` | `deleteContribution` |

POST body:
```json
{
  "timeSpentMinutes": 90,
  "description": "Implemented player movement state machine"
}
```
