import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSeriesDto } from './create-series.dto';
import { ExactData, UpdateSeries } from '@unlockit/shared';

export class UpdateSeriesDto extends PartialType(OmitType(CreateSeriesDto, ['gameIds'])) implements UpdateSeries {}

const _assertExact: ExactData<UpdateSeries, UpdateSeriesDto> = true;
