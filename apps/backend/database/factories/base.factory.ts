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

  async create(overrides: Partial<T> = {}): Promise<U> {
    this.assertDatasource();

    const item = (await this.make(overrides)) as T;

    return this.datasource!.manager.save(this.entity, item) as unknown as Promise<U>;
  }

  async createMany(count: number, overrides: Partial<T> = {}): Promise<U[]> {
    this.assertDatasource();

    const items = (await this.makeMany(count, overrides)) as T;

    return this.datasource!.manager.save(this.entity, items) as unknown as Promise<U[]>;
  }

  /**
   * Helper to get faker instance (can be overridden per locale)
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
