import { PartialType } from '@nestjs/swagger';
import { UserBillingDto } from './user-billing.dto';

export class UpdateBillingDto extends PartialType(UserBillingDto) {}
