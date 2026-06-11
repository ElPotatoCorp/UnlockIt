import { PartialType } from '@nestjs/swagger';
import { UserBillingDto } from './user-billing.dto';
import { ExactData, UpdateBilling } from '@unlockit/shared';

export class UpdateBillingDto extends PartialType(UserBillingDto) implements UpdateBilling {}

const _assertExact: ExactData<UpdateBilling, UpdateBillingDto> = true;
