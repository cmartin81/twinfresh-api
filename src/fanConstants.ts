require('dotenv').config();

export const FAN_IP_ADDRESS = process.env.FAN_IP_ADDRESS || '192.168.1.1';
export const FAN_SERIAL = process.env.FAN_SERIAL || '000000000111111';
export const FAN_PASSWORD = process.env.FAN_PASSWORD || '1111';

export enum Power {
  off = '00',
  on = '01',
  invert = '02',
}

export const mapPower: { [key: string]: Power } = {
  '00': Power.off,
  '01': Power.on,
  '02': Power.invert,
};

export enum Speed {
  speed1 = '01',
  speed2 = '02',
  speed3 = '03',
}

export const mapSpeed: { [key: string]: Speed } = {
  '01': Speed.speed1,
  '02': Speed.speed2,
  '03': Speed.speed3,
};

export enum Bost {
  off = '00',
  on = '01',
}

export enum Mode {
  ventilation = '00',
  heatRecovery = '01',
  supply = '02',
}

export enum UnitType {
  VentExpertA50_A85_A100 = 300,
  VentExpertDuoA30 = 400,
  VentExpertA30 = 500,
}
export const mapUnitType: { [key: string]: UnitType } = {
  '0300': UnitType.VentExpertA50_A85_A100,
  '0400': UnitType.VentExpertA30,
  '0500': UnitType.VentExpertA30,
};
