import { FanProperties, parseSignal } from './signalParser';
import { Power, Speed, UnitType } from '../fanConstants';

test('parseSignal', () => {
  const fanProps: FanProperties = parseSignal(
    Buffer.from(
      'fdfd0210303033353030323234373431353731350006fe02b90300fe107c30303335303032323437343135373135ba09',
      'hex',
    ),
  );
  expect(fanProps.serial?.length).toBe(16);
  expect(fanProps.unitType).toBe(UnitType.VentExpertA50_A85_A100);
});

test('parseSignal with failed checksum', () => {
  expect(() => {
    parseSignal(
      Buffer.from(
        'fdfd021030303335303032323437343135373135043131313106fe02b90300fe107c30303335303032323437343135373135bf09',
        'hex',
      ),
    );
  }).toThrow();
});

test('parseSignal with fanspeed and powerStatus', () => {
  const fanProps: FanProperties = parseSignal(
    Buffer.from(
      'fdfd021030303335303032323437343135373135043131313106020301011504',
      'hex',
    ),
  );
  expect(fanProps.speed).toBe(Speed.speed3);
  expect(fanProps.power).toBe(Power.on);
});
