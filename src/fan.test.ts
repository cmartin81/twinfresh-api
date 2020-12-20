import { Fan } from './fan';
import {
  FAN_IP_ADDRESS,
  FAN_PASSWORD,
  FAN_SERIAL,
  Power,
  Speed,
} from './fanConstants';

test('send signal to fan', async () => {
  const fan = new Fan(FAN_SERIAL, FAN_PASSWORD, FAN_IP_ADDRESS);
  const buffer = fan
    .signalBuilder()
    .setFanSpeed(Speed.speed3)
    .setPowerStatus(Power.invert)
    .buildSignal();
  console.log(buffer.toString('hex'));
  const buf = Buffer.from(
    'fdfd0210303033353030323234373431353731350431313131017c8504',
    'hex',
  );
  await Fan.send(buffer);
  // await fan.sendSignalToFan(buffer).then(() => {
  //   console.log('done');
  // });
});

test('discorver fan', async () => {
  const result = await Fan.discoverFans();
  console.log(result);
});
