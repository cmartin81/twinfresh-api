import { calcChecksum } from './checksum';
import {
  mapPower,
  mapSpeed,
  mapUnitType,
  Power,
  Speed,
  UnitType,
} from '../fanConstants';

export interface FanProperties {
  serial?: string;
  password?: string;
  unitType?: UnitType;
  power?: Power;
  speed?: Speed;
}

const actionHandlers: { [key: string]: (buffer: Buffer) => FanProperties } = {
  '01': (inputBuffer: Buffer) => {
    return {
      power: mapPower[inputBuffer.toString('hex')],
    };
  },
  '02': (inputBuffer: Buffer) => {
    return {
      speed: mapSpeed[inputBuffer.toString('hex')],
    };
  },
  '7c': (inputBuffer: Buffer) => {
    return {
      serial: inputBuffer.toString(),
    };
  },
  b9: (inputBuffer: Buffer) => {
    const value = inputBuffer.toString('hex').padStart(4, '0');
    return {
      unitType: mapUnitType[value],
    };
  },
};

export const parseSignal = (signal: Buffer): FanProperties => {
  let fanProps: FanProperties = {};
  const sigChecksum = signal.slice(signal.length - 2);
  const checksum = calcChecksum(signal.slice(2, signal.length - 2));

  const buffer = signal.slice(4, signal.length - 2); //remove signal start and checksum

  if (sigChecksum.compare(checksum) !== 0) {
    throw new Error(
      `Incorrect checksum on signal: ${checksum.toString(
        'hex',
      )} !== ${sigChecksum.toString('hex')}`,
    );
  }
  fanProps.serial = buffer.slice(0, 16).toString();
  const pwLength = parseInt(buffer.slice(16, 17).toString('hex'));
  const pwEndPos = 17 + pwLength;
  fanProps.password = buffer.slice(17, pwEndPos).toString();
  const responseByte = buffer[pwEndPos].toString(16).padStart(2, '0');

  if (responseByte !== '06') {
    throw new Error('Does not contain a response');
  }

  const resultBuffer = buffer.slice(pwEndPos + 1, buffer.length);
  const rawResponse = [];
  for (let i = 0; i < resultBuffer.length; ) {
    let keyBit = resultBuffer[i].toString(16).padStart(2, '0');
    const res = {};
    let valueSizeBit = 1;
    if (keyBit === 'fe') {
      valueSizeBit = resultBuffer[++i];
      keyBit = resultBuffer[++i].toString(16).padStart(2, '0');
    }
    console.log(keyBit);
    const valueBuffer = resultBuffer.slice(++i, i + valueSizeBit);
    i += valueSizeBit;
    if (actionHandlers[keyBit]) {
      const mappedValue = actionHandlers[keyBit](valueBuffer);
      fanProps = Object.assign({}, fanProps, mappedValue);
    }
    rawResponse.push({ keyBit, valueBuffer });
  }
  // result.rawResponse = rawResponse;
  console.log(fanProps);
  return fanProps;
};
