import { faker } from '@faker-js/faker';
import { DataSource, EntityTarget } from 'typeorm';

/**
 * Base Factory class for generating test data with faker
 * Use: const user = userFactory.make(); or userFactory.create() for persistence
 */
export abstract class Factory<T> {
  protected datasource: DataSource | null;

  protected isDataSourceInitialized() {
    if (this.datasource === null) {
      throw new Error('Datasource not provided');
    }
    if (this.datasource.isInitialized !== true) {
      throw new Error('Datasource not initialized yet');
    }
  }

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
  abstract definition(): Partial<T> | Promise<Partial<T>>;

  /**
   * Create an instance without saving (for in-memory use)
   */
  async make(overrides: Partial<T> = {}): Promise<T> {
    const baseDefinition = await this.definition();

    return {
      ...baseDefinition,
      ...overrides,
    } as T;
  }

  /**
   * Create multiple instances
   */
  async makeMany(count: number, overrides: Partial<T> = {}): Promise<T[]> {
    return Promise.all(
      Array.from({ length: count }, () => this.make(overrides)),
    );
  }

  async create(overrides: Partial<T> = {}) {
    this.isDataSourceInitialized();

    const item = await this.make(overrides);

    return this.datasource!.manager.save(this.entity, item);
  }

  async createMany(count: number, overrides: Partial<T> = {}): Promise<T[]> {
    this.isDataSourceInitialized();

    const items = await this.makeMany(count, overrides);

    return this.datasource!.manager.save(this.entity, items);
  }

  /**
   * Helper to get faker instance (can be overridden per locale)
   */
  protected get fk() {
    return faker;
  }
}
