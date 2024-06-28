import { OneClickDto } from '@verifiedinc/core-types';
import { Brand } from './getBrand';

export const rooms = {
  buildOneClickRoom(brand: Brand, oneClickDto: OneClickDto) {
    return this.oneClickRoom(
      brand.uuid,
      Object.values(oneClickDto.identifiers)[0]
    );
  },
  oneClickRoom: (brandUuid: string, phone: string) => `${brandUuid}-${phone}`,
};
