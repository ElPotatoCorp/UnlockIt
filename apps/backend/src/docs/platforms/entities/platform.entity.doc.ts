import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const PlatformEntityDoc = {
  Windows: () =>
    applyDecorators(
      ApiProperty({ title: 'Windows', type: Boolean, default: false }),
    ),
  Mac: () =>
    applyDecorators(
      ApiProperty({ title: 'macOS', type: Boolean, default: false }),
    ),
  Linux: () =>
    applyDecorators(
      ApiProperty({ title: 'Linux', type: Boolean, default: false }),
    ),
  Ios: () =>
    applyDecorators(
      ApiProperty({ title: 'iOS', type: Boolean, default: false }),
    ),
  Android: () =>
    applyDecorators(
      ApiProperty({ title: 'Android', type: Boolean, default: false }),
    ),
  Switch: () =>
    applyDecorators(
      ApiProperty({ title: 'Nintendo Switch', type: Boolean, default: false }),
    ),
  Ps4: () =>
    applyDecorators(
      ApiProperty({ title: 'PlayStation 4', type: Boolean, default: false }),
    ),
  Ps5: () =>
    applyDecorators(
      ApiProperty({ title: 'PlayStation 5', type: Boolean, default: false }),
    ),
  XboxOne: () =>
    applyDecorators(
      ApiProperty({ title: 'Xbox One', type: Boolean, default: false }),
    ),
  XboxSeries: () =>
    applyDecorators(
      ApiProperty({ title: 'Xbox Series', type: Boolean, default: false }),
    ),
};
