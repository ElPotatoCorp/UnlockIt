import 'reflect-metadata';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import dataSourceConfig from '../data-source';
import { DataSource } from 'typeorm';

async function clearTable(dataSource: DataSource, targetTable: string) {
  const entityManager = dataSource.manager;
  const entities = dataSource.entityMetadatas;

  const matchedEntity = entities.find(
    (e) =>
      e.tableName.toLowerCase() === targetTable.toLowerCase() ||
      e.name.toLowerCase() === targetTable.toLowerCase(),
  );

  if (!matchedEntity) {
    console.error(
      `Table or Entity "${targetTable}" not found in database metadata.`,
    );
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });
  console.warn(
    ` WARNING: You are about to clear ALL data from table "${matchedEntity.tableName}".`,
  );
  const answer = await rl.question(
    'This action might CASCADE and delete rows in related tables. Type "yes" to proceed: ',
  );
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('Action aborted by user.');
    process.exit(0);
  }

  console.log(`Clearing table "${matchedEntity.tableName}"...`);
  if (dataSource.options.type === 'postgres') {
    await entityManager.query(
      `TRUNCATE TABLE "${matchedEntity.tableName}" RESTART IDENTITY CASCADE;`,
    );
  } else {
    await entityManager.query(`DELETE FROM "${matchedEntity.tableName}";`);
  }
  console.log(`Table "${matchedEntity.tableName}" cleared successfully.`);
}

async function clearAll(dataSource: DataSource) {
  const entityManager = dataSource.manager;
  const entities = dataSource.entityMetadatas;

  const rl = readline.createInterface({ input, output });

  try {
    console.warn(
      '\n WARNING: You are about to completely wipe all data from the database!',
    );

    // First Confirmation
    const firstAnswer = await rl.question(
      'Are you absolutely sure you want to clear the entire database? (type "yes" to proceed): ',
    );
    if (firstAnswer.toLowerCase() !== 'yes') {
      console.log('Action aborted by user.');
      process.exit(0);
    }

    // Second Confirmation (Double-check)
    console.warn(
      '\n FINAL WARNING: This action cannot be undone and will delete ALL rows across ALL tables!',
    );
    const secondAnswer = await rl.question(
      'This is your last chance. Confirm by typing "yes" once more: ',
    );
    if (secondAnswer.toLowerCase() !== 'yes') {
      console.log('Action aborted at final confirmation.');
      process.exit(0);
    }

    rl.close();

    // That's the dangerous part!
    console.log('\nClearing entire database...');
    const tableNames = entities.map((e) => `"${e.tableName}"`).join(', ');

    if (tableNames) {
      if (dataSource.options.type === 'postgres') {
        await entityManager.query(
          `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
        );
      }
      console.log('All database rows cleared successfully.');
    } else {
      console.log('No tables found to clear.');
    }
  } catch (error) {
    rl.close();
    throw error;
  }
}

async function clear() {
  // Production Safeguard
  if (process.env.NODE_ENV === 'production') {
    console.error(
      'ERROR: Database commands cannot be executed in a PRODUCTION environment!',
    );
    process.exit(1);
  }

  const dataSource = dataSourceConfig;

  // Read arguments: npm run database:clear -- [targetTable]
  const args = process.argv.slice(2);
  const targetTable = args[0]; // e.g., "user" or undefined

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    if (targetTable) {
      await clearTable(dataSource, targetTable);
    } else {
      await clearAll(dataSource);
    }
  } catch (error) {
    console.error('Clear execution failed:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void clear();
