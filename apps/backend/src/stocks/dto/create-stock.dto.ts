import { CreateStock } from "@unlockit/shared";
import { Type } from "class-transformer";
import { IsArray, IsString, Length } from "class-validator";

export class CreateStockDto implements CreateStock {
  @IsArray()
  @IsString({ each: true })
  @Length(10, 100, { each: true })
  @Type(() => String)
  productKeys: string[];
}
