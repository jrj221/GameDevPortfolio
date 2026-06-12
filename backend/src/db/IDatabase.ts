export interface GetItemInput {
  tableName: string;
  key: Record<string, unknown>;
}

export interface PutItemInput {
  tableName: string;
  item: Record<string, unknown>;
}

export interface QueryInput {
  tableName: string;
  keyConditionExpression: string;
  expressionAttributeNames: Record<string, string>;
  expressionAttributeValues: Record<string, unknown>;
}

export interface DeleteItemInput {
  tableName: string;
  key: Record<string, unknown>;
}

export interface ScanInput {
  tableName: string;
}

export interface IDatabase {
  getItem(input: GetItemInput): Promise<Record<string, unknown> | null>;
  putItem(input: PutItemInput): Promise<void>;
  query(input: QueryInput): Promise<Record<string, unknown>[]>;
  deleteItem(input: DeleteItemInput): Promise<void>;
  scan(input: ScanInput): Promise<Record<string, unknown>[]>;
}
