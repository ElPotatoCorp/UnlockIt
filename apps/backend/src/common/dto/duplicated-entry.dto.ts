import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { DuplicatedEntry, ExactData } from '@unlockit/shared';

export const DuplicatedEntryDtoSchemaDoc = (
  itemType: any,
  allowedFields: string[],
) => ({
  allOf: [
    { $ref: getSchemaPath(DuplicatedEntryDto) },
    {
      properties: {
        invalidFields: {
          type: 'array',
          items: {
            type: 'string',
            enum: allowedFields,
          },
        },
        messages: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'A map of invalid fields and their reason messages',
        },
      },
    },
  ],
});

export class DuplicatedEntryDto<T> implements DuplicatedEntry<T> {
  @ApiProperty({
    description: "Every fields that does't respect the unique constraint",
    isArray: true,
  })
  invalidFields: (keyof T)[] = [];

  @ApiProperty({
    description:
      'Human-readable message concerning every fields contained in `invaliedFields`',
  })
  messages: Partial<Record<keyof T, string>> = {};
}

const _assertExact: ExactData<DuplicatedEntry<any>, DuplicatedEntryDto<any>> = true;