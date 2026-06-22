import * as fs from 'node:fs';
import * as path from 'node:path';
import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';
import { GameEntity } from 'src/games/entities/game.entity';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { DeveloperEntity } from 'src/developers/entities/developer.entity';
import { PublisherEntity } from 'src/publishers/entities/publisher.entity';
import { GamePlatformEntity } from 'src/platforms/entities/game-platform.entity';
import { MediaEntity } from 'src/media/entities/media.entity';
import {
  EUAgeRating,
  GamePlatform,
  GameType,
  LangCode,
  MediaType,
} from '@unlockit/shared';
import { Factory } from './base.factory';
import { SeriesEntity } from 'src/series/entities/series.entity';

// ---------------------------------------------------------------------------
// JSON shape (what lives on disk)
// ---------------------------------------------------------------------------

interface GameJson {
  name: string;
  type: string;
  ageRating: number;
  releaseDate: string | null;
  comingSoon: boolean;
  tags: string[];
  platforms: GamePlatform;
  publishers: string[];
  developers: string[];
  shortDescription: string;
  detailedDescription: string;
  website: string | null;
  headerImage: string;
  coverImage: string;
  backgroundImage: string;
  screenshotUrls: string[];
  price: number;
  pcRequirements: string | null;
  supportedLanguages: string[];
  metacriticScore: number | null;
  series: { name: string; slug: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GAMES_DIR = path.resolve(__dirname, '../seeds/default/games');

/** Return all .json slugs available on disk */
function allSlugsOnDisk(): string[] {
  return fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.basename(f, '.json'));
}

/** Read and parse a single game JSON file by slug */
function readGameJson(slug: string): GameJson {
  const filePath = path.join(GAMES_DIR, `${slug}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as GameJson;
}

/** Pick `n` unique random items from an array */
function pickRandom<T>(pool: T[], n: number): T[] {
  const copy = [...pool];
  const result: T[] = [];

  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }

  return result;
}

const AGE_RATING_MAP: Record<number, EUAgeRating> = {
  3: EUAgeRating.THREE,
  7: EUAgeRating.SEVEN,
  12: EUAgeRating.TWELVE,
  16: EUAgeRating.SIXTEEN,
  18: EUAgeRating.EIGHTEEN,
};

// ---------------------------------------------------------------------------
// GameFactory
// ---------------------------------------------------------------------------

export class GameFactory extends Factory<GameEntity> {
  // -------------------------------------------------------------------------
  // Guard: filter out slugs already present in the DB
  // -------------------------------------------------------------------------

  /**
   * Returns slugs that exist on disk but NOT yet in the database.
   * If the datasource is unavailable we simply return all disk slugs
   * (useful for pure in-memory make() calls).
   */
  private async availableSlugs(): Promise<string[]> {
    const onDisk = allSlugsOnDisk();

    if (!this.datasource?.isInitialized) {
      return onDisk;
    }

    const existing = await this.datasource.manager
      .createQueryBuilder(GameEntity, 'game')
      .select('game.slug')
      .getMany();

    const existingSlugs = new Set(existing.map((g) => g.slug));
    return onDisk.filter((s) => !existingSlugs.has(s));
  }

  get entity(): EntityTarget<GameEntity> {
    return GameEntity;
  }

  definition(_slug?: string) {
    const slug = _slug!;

    const json = readGameJson(slug);

    // --- Game scalar fields -------------------------------------------------
    const game = new GameEntity();

    game.slug = slug;
    game.name = json.name;
    game.type = (json.type as GameType) ?? GameType.GAME;
    game.price = json.price;
    game.ageRating = AGE_RATING_MAP[json.ageRating] ?? EUAgeRating.SEVEN;
    game.releaseDate = json.releaseDate ?? null;
    game.comingSoon = json.comingSoon;
    game.headerImage = json.headerImage;
    game.coverImage = json.coverImage;
    game.backgroundImage = json.backgroundImage;
    game.shortDescription = json.shortDescription;
    game.detailedDescription = json.detailedDescription;
    game.metacriticScore = json.metacriticScore ?? null;
    game.website = json.website ?? null;
    game.pcRequirements = json.pcRequirements ?? null;
    game.supportedLanguages = (json.supportedLanguages as LangCode[]) ?? null;

    // --- Platforms ----------------------------------------------------------
    game.platforms = new GamePlatformEntity();
    Object.assign(game.platforms, json.platforms);

    // --- Tags ---------------------------------------------------------------
    game.tags = json.tags.map((name) => {
      const tag = new TagEntity();
      tag.name = name;
      return tag;
    });

    // --- Developers ---------------------------------------------------------
    game.developers = json.developers.map((name) => {
      const dev = new DeveloperEntity();
      dev.name = name;
      return dev;
    });

    // --- Publishers ---------------------------------------------------------
    game.publishers = json.publishers.map((name) => {
      const pub = new PublisherEntity();
      pub.name = name;
      return pub;
    });

    // --- Media (screenshots only for now) -----------------------------------
    game.media = json.screenshotUrls.map((url) => {
      const m = new MediaEntity();
      m.game = game;
      m.url = url;
      m.type = MediaType.IMAGE;
      return m;
    });

    // --- Series -------------------------------------------------------------
    game.series = new SeriesEntity();
    Object.assign(game.series, json.series);

    return game;
  }

  // -------------------------------------------------------------------------
  // Overrides
  // -------------------------------------------------------------------------

  async make() {
    const [result] = await this.makeMany(1);
    return result;
  }

  async makeMany(count: number) {
    const available = await this.availableSlugs();

    if (available.length === 0) {
      throw new Error(
        'GameFactory: no more games available to create, all games available are already in the database.',
      );
    }

    const actual = Math.min(count, available.length);

    if (actual < count) {
      console.warn(
        `GameFactory: requested ${count} game(s) but only ${actual} slug(s) are available. Creating ${actual}.`,
      );
    }

    const slugs = pickRandom(available, actual);
    return Promise.all(slugs.map((slug) => this.definition(slug)));
  }

  async create() {
    const [result] = await this.createMany(1);
    return result;
  }

  async createMany(count: number) {
    this.assertDatasource();

    const resolved = await this.makeMany(count);

    const results: GameEntity[] = [];
    for (const r of resolved) {
      results.push(await this.persist(r));
    }

    return results;
  }

  // -------------------------------------------------------------------------
  // persist : upsert all entities for one game inside a transaction
  // -------------------------------------------------------------------------

  private async persist(game: GameEntity): Promise<GameEntity> {
    const ds = this.datasource!;

    return ds.transaction(async (manager) => {
      const savedTags: TagEntity[] = [];
      for (const t of game.tags) {
        savedTags.push(
          await this.upsertByName(manager, TagEntity, { name: t.name }),
        );
      }

      const savedDevs: DeveloperEntity[] = [];
      for (const d of game.developers) {
        savedDevs.push(
          await this.upsertByName(manager, DeveloperEntity, { name: d.name }),
        );
      }

      const savedPubs: PublisherEntity[] = [];
      for (const p of game.publishers) {
        savedPubs.push(
          await this.upsertByName(manager, PublisherEntity, { name: p.name }),
        );
      }

      game.series = game.series?.name
        ? await this.upsertByName(manager, SeriesEntity, {
            name: game.series.name,
            slug: game.series.slug,
          })
        : null;

      const savedGame = await manager.save(GameEntity, game);

      await manager
        .createQueryBuilder()
        .relation(GameEntity, 'tags')
        .of(savedGame.id)
        .add(savedTags.map((t) => t.id));

      await manager
        .createQueryBuilder()
        .relation(GameEntity, 'developers')
        .of(savedGame.id)
        .add(savedDevs.map((d) => d.id));

      await manager
        .createQueryBuilder()
        .relation(GameEntity, 'publishers')
        .of(savedGame.id)
        .add(savedPubs.map((p) => p.id));

      await manager.save(
        MediaEntity,
        game.media.map((m) => ({
          ...m,
          game: savedGame,
          gameId: savedGame.id,
        })),
      );

      return game;
    });
  }

  // -------------------------------------------------------------------------
  // upsertByName : find-or-create for Tag / Developer / Publisher
  // -------------------------------------------------------------------------

  private async upsertByName<E extends ObjectLiteral>(
    manager: EntityManager,
    target: EntityTarget<E>,
    values: any,
  ): Promise<E> {
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into(target)
      .values(values)
      .orIgnore() // INSERT ... ON CONFLICT DO NOTHING
      .returning('*')
      .execute();

    if (result.raw.length > 0) {
      return result.raw[0] as E;
    }

    return manager.findOneByOrFail(target, values);
  }
}
