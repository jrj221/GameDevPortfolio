import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand,
  ScanCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { IDatabase, GetItemInput, PutItemInput, QueryInput, DeleteItemInput, ScanInput } from "./IDatabase";

export class DynamoDBDatabase implements IDatabase {
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({ region: process.env["AWS_REGION"] ?? "us-east-1" });
  }

  async getItem(input: GetItemInput): Promise<Record<string, unknown> | null> {
    const result = await this.client.send(
      new GetItemCommand({
        TableName: input.tableName,
        Key: marshall(input.key),
      })
    );
    return result.Item ? unmarshall(result.Item) : null;
  }

  async putItem(input: PutItemInput): Promise<void> {
    await this.client.send(
      new PutItemCommand({
        TableName: input.tableName,
        Item: marshall(input.item),
      })
    );
  }

  async query(input: QueryInput): Promise<Record<string, unknown>[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: input.tableName,
        KeyConditionExpression: input.keyConditionExpression,
        ExpressionAttributeNames: input.expressionAttributeNames,
        ExpressionAttributeValues: marshall(input.expressionAttributeValues),
      })
    );
    return (result.Items ?? []).map((item) => unmarshall(item));
  }

  async deleteItem(input: DeleteItemInput): Promise<void> {
    await this.client.send(
      new DeleteItemCommand({
        TableName: input.tableName,
        Key: marshall(input.key),
      })
    );
  }

  async scan(input: ScanInput): Promise<Record<string, unknown>[]> {
    const items: Record<string, unknown>[] = [];
    let lastKey: Record<string, AttributeValue> | undefined;
    do {
      const result = await this.client.send(
        new ScanCommand({
          TableName: input.tableName,
          ExclusiveStartKey: lastKey,
        })
      );
      for (const item of result.Items ?? []) {
        items.push(unmarshall(item));
      }
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);
    return items;
  }
}
