import type { IDatabase } from "./IDatabase";
import { DynamoDBDatabase } from "./DynamoDBDatabase";

type DatabaseDriver = "dynamo";

export class DatabaseFactory {
  static create(driver: DatabaseDriver = "dynamo"): IDatabase {
    switch (driver) {
      case "dynamo":
        return new DynamoDBDatabase();
    }
  }
}
