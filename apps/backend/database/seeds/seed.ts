import 'reflect-metadata';
import dataSourceConfig from '../data-source';
import { UserFactory } from '../factories/user.factory';
import { DataSource } from 'typeorm';

// I don't know how to make it absolutely dynamic so I just put every possibilities here
const FACTORY_REGISTRY: Record<string, any> = {
  users: UserFactory,
};

type SpecificOptions = {
  entity: string;
  count: number;
};

async function specific(dataSource: DataSource, options: SpecificOptions) {
  const FactoryClass = FACTORY_REGISTRY[options.entity.toLowerCase()];

  if (!FactoryClass) {
    console.error(`Factory for entity "${options.entity}" not found.`);
    console.log(`Available entities: ${Object.keys(FACTORY_REGISTRY).join(', ')}`);
    process.exit(1);
  }

  const factory = new FactoryClass(dataSource);
  console.log(`Seeding ${options.count} individual instance(s) of "${options.entity}"...`);

  const results = await factory.createMany(options.count);
  console.log(`Successfully seeded ${results.length} row(s) into the database!`);
}

async function init(dataSource: DataSource) {
  console.log('Running master blueprint configuration (Seeding ALL)...');

  // Initialize factories
  const userFactory = new UserFactory(dataSource);

  // Execute your premade step-by-step pipeline sequence:
  console.log('-> Seeding batch: Users');
  const users = await userFactory.createMany(5);
  console.log(`   Created ${users.length} default users.`);

  console.log('\nGlobal database seeding finished successfully!');
}

async function seed() {
  // Production Safeguard
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: Database commands cannot be executed in a PRODUCTION environment!');
    process.exit(1);
  }

  const dataSource = dataSourceConfig;

  // Read arguments: npm run database:seed -- [entityName] [quantity]
  const args = process.argv.slice(2);
  const entityArg = args[0]; // e.g. "user" or undefined
  const quantityArg = parseInt(args[1], 10); // e.g. "10" or NaN
  const count = isNaN(quantityArg) ? 1 : quantityArg;

  const options: SpecificOptions = { entity: entityArg, count };

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Connected to database');
    options.entity ? await specific(dataSource, options) : await init(dataSource);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();