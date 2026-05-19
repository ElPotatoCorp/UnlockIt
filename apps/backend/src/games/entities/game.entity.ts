import { DecimalColumnTransformer } from "src/common/transformers/decimal-column.transformer";
import { GameEntityDoc } from "src/docs/games/entities/game.entity.doc";
import { Series } from "src/series/entities/series.entity";
import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum GameType {
  GAME = 'game',
  DLC = 'dlc',
  OST = 'ost',
}

export enum EUAgeRating {
  THREE = 3,
  SEVEN = 7,
  TWELVE = 12,
  SIXTEEN = 16,
  EIGHTEEN = 18,
}

export enum LangCode {
  AA = 'aa',
  AB = 'ab',
  AE = 'ae',
  AF = 'af',
  AK = 'ak',
  AM = 'am',
  AN = 'an',
  AR = 'ar',
  AS = 'as',
  AV = 'av',
  AY = 'ay',
  AZ = 'az',
  BA = 'ba',
  BE = 'be',
  BG = 'bg',
  BI = 'bi',
  BM = 'bm',
  BN = 'bn',
  BO = 'bo',
  BR = 'br',
  BS = 'bs',
  CA = 'ca',
  CE = 'ce',
  CH = 'ch',
  CO = 'co',
  CR = 'cr',
  CS = 'cs',
  CU = 'cu',
  CV = 'cv',
  CY = 'cy',
  DA = 'da',
  DE = 'de',
  DV = 'dv',
  DZ = 'dz',
  EE = 'ee',
  EL = 'el',
  EN = 'en',
  EO = 'eo',
  ES = 'es',
  ET = 'et',
  EU = 'eu',
  FA = 'fa',
  FF = 'ff',
  FI = 'fi',
  FJ = 'fj',
  FO = 'fo',
  FR = 'fr',
  FY = 'fy',
  GA = 'ga',
  GD = 'gd',
  GL = 'gl',
  GN = 'gn',
  GU = 'gu',
  GV = 'gv',
  HA = 'ha',
  HE = 'he',
  HI = 'hi',
  HO = 'ho',
  HR = 'hr',
  HT = 'ht',
  HU = 'hu',
  HY = 'hy',
  HZ = 'hz',
  IA = 'ia',
  ID = 'id',
  IE = 'ie',
  IG = 'ig',
  II = 'ii',
  IK = 'ik',
  IO = 'io',
  IS = 'is',
  IT = 'it',
  IU = 'iu',
  JA = 'ja',
  JV = 'jv',
  KA = 'ka',
  KG = 'kg',
  KI = 'ki',
  KJ = 'kj',
  KK = 'kk',
  KL = 'kl',
  KM = 'km',
  KN = 'kn',
  KO = 'ko',
  KR = 'kr',
  KS = 'ks',
  KU = 'ku',
  KV = 'kv',
  KW = 'kw',
  KY = 'ky',
  LA = 'la',
  LB = 'lb',
  LG = 'lg',
  LI = 'li',
  LN = 'ln',
  LO = 'lo',
  LT = 'lt',
  LU = 'lu',
  LV = 'lv',
  MG = 'mg',
  MH = 'mh',
  MI = 'mi',
  MK = 'mk',
  ML = 'ml',
  MN = 'mn',
  MR = 'mr',
  MS = 'ms',
  MT = 'mt',
  MY = 'my',
  NA = 'na',
  NB = 'nb',
  ND = 'nd',
  NE = 'ne',
  NG = 'ng',
  NL = 'nl',
  NN = 'nn',
  NO = 'no',
  NR = 'nr',
  NV = 'nv',
  NY = 'ny',
  OC = 'oc',
  OJ = 'oj',
  OM = 'om',
  OR = 'or',
  OS = 'os',
  PA = 'pa',
  PI = 'pi',
  PL = 'pl',
  PS = 'ps',
  PT = 'pt',
  QU = 'qu',
  RM = 'rm',
  RN = 'rn',
  RO = 'ro',
  RU = 'ru',
  RW = 'rw',
  SA = 'sa',
  SC = 'sc',
  SD = 'sd',
  SE = 'se',
  SG = 'sg',
  SI = 'si',
  SK = 'sk',
  SL = 'sl',
  SM = 'sm',
  SN = 'sn',
  SO = 'so',
  SQ = 'sq',
  SR = 'sr',
  SS = 'ss',
  ST = 'st',
  SU = 'su',
  SV = 'sv',
  SW = 'sw',
  TA = 'ta',
  TE = 'te',
  TG = 'tg',
  TH = 'th',
  TI = 'ti',
  TK = 'tk',
  TL = 'tl',
  TN = 'tn',
  TO = 'to',
  TR = 'tr',
  TS = 'ts',
  TT = 'tt',
  TW = 'tw',
  TY = 'ty',
  UG = 'ug',
  UK = 'uk',
  UR = 'ur',
  UZ = 'uz',
  VE = 've',
  VI = 'vi',
  VO = 'vo',
  WA = 'wa',
  WO = 'wo',
  XH = 'xh',
  YI = 'yi',
  YO = 'yo',
  ZA = 'za',
  ZH = 'zh',
  ZU = 'zu',
}

@Entity('games')
@Check(`"price" >= 0`)
@Check(`"metacritic_score" BETWEEN 0 AND 100 OR "metacritic_score" IS NULL`)
export class Game {
  @GameEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @GameEntityDoc.Name()
  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @GameEntityDoc.Slug()
  @Column('varchar', { length: 255, nullable: false, unique: true })
  slug: string;

  @GameEntityDoc.Type()
  @Column('enum', { enum: GameType, default: GameType.GAME })
  type: GameType;

  @GameEntityDoc.Price()
  @Column('decimal', { precision: 10, scale: 2, nullable: false, transformer: new DecimalColumnTransformer() })
  price: number;

  @GameEntityDoc.AgeRating()
  @Column('enum', { name: 'age_rating', enum: EUAgeRating, default: EUAgeRating.EIGHTEEN })
  ageRating: EUAgeRating;

  @GameEntityDoc.ReleaseDate()
  @Column('date', { name: 'release_date', nullable: true })
  releaseDate: Date | null;

  @GameEntityDoc.ComingSoon()
  @Column('boolean', { name: 'coming_soon', default: false })
  comingSoon: boolean;

  @GameEntityDoc.HeaderImage()
  @Column('varchar', { name: 'header_image', length: 255, nullable: false })
  headerImage: string;

  @GameEntityDoc.CoverImage()
  @Column('varchar', { name: 'cover_image', length: 255, nullable: false })
  coverImage: string;

  @GameEntityDoc.BackgroundImage()
  @Column('varchar', { name: 'background_image', length: 255, nullable: false })
  backgroundImage: string;

  @GameEntityDoc.ShortDescription()
  @Column('text', { name: 'short_description', nullable: false })
  shortDescription: string;

  @GameEntityDoc.DetailedDescription()
  @Column('text', { name: 'detailed_description', nullable: false })
  detailedDescription: string;

  @GameEntityDoc.MetacriticScore()
  @Column('smallint', { name: 'metacritic_score', nullable: true })
  metacriticScore: number | null;

  @GameEntityDoc.Website()
  @Column('varchar', { length: 255, nullable: true })
  website: string | null;

  @GameEntityDoc.PcRequirements()
  @Column('text', { name: 'pc_requirements', nullable: true })
  pcRequirements: string | null;

  @GameEntityDoc.SupportedLanguages()
  @Column('enum', { name: 'supported_languages', enum: LangCode, array: true, nullable: true })
  supportedLanguages: LangCode[] | null;

  // =====================================================
  // Relations
  // =====================================================

  @ManyToOne(() => Series, (series) => series.games, { lazy: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'series_id' })
  series: Series | null;
}
