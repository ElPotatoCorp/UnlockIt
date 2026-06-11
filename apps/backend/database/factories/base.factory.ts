import { faker } from '@faker-js/faker';
import { DataSource, EntityTarget } from 'typeorm';

/**
 * Base Factory class for generating test data with faker
 * Use: const user = userFactory.make(); or userFactory.create() for persistence
 */
export abstract class Factory<T, U = T> {
  protected datasource: DataSource | null;

  constructor(datasource?: DataSource) {
    this.datasource = datasource ?? null;
  }

  /**
   * Every child factory must define which TypeORM entity it belongs to.
   * e.g., entity = User;
   */
  abstract get entity(): EntityTarget<T>;

  /**
   * Define attributes for the entity
   */
  abstract definition(): Partial<U> | Promise<Partial<U>>;

  /**
   * Create an instance without saving (for in-memory use)
   */
  async make(overrides: Partial<T> = {}): Promise<U> {
    const baseDefinition = await this.definition();

    return {
      ...baseDefinition,
      ...overrides,
    } as U;
  }

  /**
   * Create multiple instances
   */
  async makeMany(count: number, overrides: Partial<T> = {}): Promise<U[]> {
    return Promise.all(
      Array.from({ length: count }, () => this.make(overrides)),
    );
  }

  /**
   * Create and insert an instance in the db 
   */
  async create(overrides: Partial<T> = {}): Promise<U> {
    const [result] = await this.createMany(1, overrides);
    return result;
  }

  /**
   * Create and insert multiple instances
   */
  async createMany(count: number, overrides: Partial<T> = {}): Promise<U[]> {
    this.assertDatasource();

    const items = (await this.makeMany(count, overrides)) as T;

    const resolvedItems = this.datasource!.manager.create(this.entity, items);

    return this.datasource!.manager.save(this.entity, resolvedItems) as Promise<U[]>;
  }

  /**
   * Helper to get faker instance
   */
  protected get fk() {
    return faker;
  }

  // -------------------------------------------------------------------------
  // Internal guard
  // -------------------------------------------------------------------------

  protected assertDatasource(): void {
    if (!this.datasource) {
      throw new Error(`${this.constructor.name}: DataSource not provided.`);
    }
    if (!this.datasource.isInitialized) {
      throw new Error(`${this.constructor.name}: DataSource is not initialized.`);
    }
  }
}
