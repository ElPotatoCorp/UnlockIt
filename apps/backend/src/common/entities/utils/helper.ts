import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export function buildNotFoundMessage<T extends ObjectLiteral>(
  repository: Repository<T>,
  fields: (keyof T)[],
  values: unknown[],
): string {
  const entity = repository.metadata.name.replace('Entity', '');
  const fieldList = fields.map((f) => `'${String(f)}'`).join(', ');
  const valueList = values.map((v) => `'${String(v)}'`).join(', ');
  const plural = fields.length > 1;

  return (
    `${entity} with field${plural ? 's' : ''} (${fieldList}) ` +
    `and value${plural ? 's' : ''} (${valueList}) not found`
  );
}

export function buildWhere<T extends ObjectLiteral>(
  fields: (keyof T)[],
  values: unknown[],
): FindOptionsWhere<T> {
  return Object.fromEntries(
    fields.map((key, idx) => [key, values[idx]]),
  ) as FindOptionsWhere<T>;
}