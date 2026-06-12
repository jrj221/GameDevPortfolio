export interface IRepository<T, TCreateInput> {
  getById(partitionKey: string, sortKey: string): Promise<T | null>;
  listByPartition(partitionKey: string): Promise<T[]>;
  create(input: TCreateInput): Promise<T>;
  delete(partitionKey: string, sortKey: string): Promise<void>;
}
