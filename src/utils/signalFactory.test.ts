import { SignalFactory } from './signalFactory';
import { FAN_PASSWORD, FAN_SERIAL } from '../fanConstants';

test('createSignal', () => {
  const buffer = new SignalFactory(FAN_SERIAL, FAN_PASSWORD)
    .getFanSpeed()
    .getPowerStatus()
    .buildSignal();
  console.log(buffer.toString('hex'));
});
