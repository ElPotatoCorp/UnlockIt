import 'reflect-metadata';
import dataSourceConfig from '../data-source';
import { UserFactory } from '../factories/user.factory';
import { DataSource } from 'typeorm';
import { GameFactory } from 'database/factories/game.factory';
import { StockFactory } from 'database/factories/stock.factory';
import { randomUUID } from 'crypto';
import { EmployeeRole } from '@unlockit/shared';
import { UserEntity } from 'src/user/entities/user.entity';

// I don't know how to make it absolutely dynamic so I just put every possibilities here
const FACTORIES: [name: string, factory: any][] = [
  ['users', UserFactory],
  ['games', GameFactory],
  ['stocks', StockFactory],
];

const FACTORY_REGISTRY: Record<string, any> = Object.fromEntries(
  FACTORIES.map((value) => [value[0], value[1]]),
);

type SpecificOptions = {
  entity: string;
  count: number;
  overrides?: Record<string, any>;
};

async function createOwnerElseARandomOne(dataSource: DataSource, userFactory: UserFactory) {
  if (await dataSource.manager.exists(UserEntity, { where: { username: 'TestUser' } }))
    return userFactory.create();
  
  const uuid = randomUUID();
  return userFactory.create({
    id: uuid,
    username: "TestUser",
    email: 'test@test.test',
    password: "Test123&",
    employee: {
      role: EmployeeRole.OWNER,
      createdBy: uuid,
    },
  })
}

function createOverrides(rawArgs: string[]): Record<string, any> {
  return Object.fromEntries(rawArgs.map((arg) => arg.split('=').slice(0, 2)));
}

async function specific(dataSource: DataSource, options: SpecificOptions) {
  const FactoryClass = FACTORY_REGISTRY[options.entity.toLowerCase()];

  if (!FactoryClass) {
    console.error(`Factory for entity "${options.entity}" not found.`);
    console.log(
      `Available entities: ${Object.keys(FACTORY_REGISTRY).join(', ')}`,
    );
    process.exit(1);
  }

  const factory = new FactoryClass(dataSource);
  console.log(
    `Seeding ${options.count} individual instance(s) of "${options.entity}"...`,
  );

  const results = await factory.createMany(options.count, options.overrides);
  console.log(
    `Successfully seeded ${results.length} row(s) into the database!`,
  );
}

async function init(dataSource: DataSource) {
  console.log('Running master blueprint configuration (Seeding ALL)...');

  // Initialize factories
  const userFactory = new UserFactory(dataSource);
  const gameFactory = new GameFactory(dataSource);
  const stockFactory = new StockFactory(dataSource);

  console.log('-> Seeding batch: Users');
  const users = await userFactory.createMany(4);
  users.push(await createOwnerElseARandomOne(dataSource, userFactory));
  console.log(`   Created ${users.length} default users.`);

  console.log('-> Seeding batch: Games');
  const games = await gameFactory.createMany(64)
    .then(games => { console.log(`   Created ${games.length} default games.`); })
    .catch(() => console.log('All games were already created, skipping...'));

  console.log('-> Seeding batch: Stocks');
  const stocks = await stockFactory.createMany(10000);
  console.log(`   Created ${stocks.length} default stocks.`);

  console.log('\nGlobal database seeding finished successfully!');
}

async function seed() {
  // Production Safeguard
  if (process.env.NODE_ENV === 'production') {
    console.error(
      'ERROR: Database commands cannot be executed in a PRODUCTION environment!',
    );
    process.exit(1);
  }

  const dataSource = dataSourceConfig;

  // Read arguments: npm run database:seed -- [entityName] [quantity] overrideKey1=overrideValue1 ...
  const args = process.argv.slice(2);
  const entityArg = args[0]; // e.g. "user" or undefined
  const quantityArg = parseInt(args[1], 10); // e.g. "10" or NaN
  const count = isNaN(quantityArg) ? 1 : quantityArg;

  let overrides: Record<string, any> | undefined;
  if (args.length > 1 && !isNaN(quantityArg)) {
    overrides = createOverrides(args.slice(2));
  } else if (args.length > 1 && isNaN(quantityArg)) {
    overrides = createOverrides(args.slice(1));
  }

  const options: SpecificOptions = { entity: entityArg, count, overrides };

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Connected to database');
    if (options.entity) {
      await specific(dataSource, options);
    } else {
      await init(dataSource);
    }
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
