import { DEFAULT_ECDH_CURVE } from 'tls';
import { Power, Speed } from '../fanConstants';
import { calcChecksum } from './checksum';

const startBuffer = Buffer.from('FDFD0210', 'hex');

enum SignalState {
  R = '01',
  W = '02',
  RW = '03',
  INC = '04',
  DEC = '05',
}

export class SignalFactory {
  private buffers: Buffer[] = [];
  private signalState: SignalState | null = null;

  constructor(private serial: string, private pw: string) {
    this.buffers.push(startBuffer);
    this.buffers.push(Buffer.from(serial)); //serienr
    this.buffers.push(
      Buffer.from(pw.length.toString().padStart(2, '0'), 'hex'),
    ); //serienr
    this.buffers.push(Buffer.from(pw)); //serienr
  }

  buildSignal(): Buffer {
    let buffer = Buffer.concat(this.buffers);
    const checksum = calcChecksum(buffer.slice(2));
    buffer = Buffer.concat([buffer, checksum]);
    return buffer;
  }

  private setSignalStateIfNeeded(signalState: SignalState) {
    if (!this.signalState) {
      this.buffers.push(Buffer.from(signalState.toString(), 'hex'));
      this.signalState = signalState;
    } else if (this.signalState !== signalState) {
      this.buffers.push(Buffer.from('FC', 'hex'));
      this.buffers.push(Buffer.from(signalState.toString(), 'hex'));
      this.signalState = signalState;
    }
  }

  getFanSpeed() {
    this.setSignalStateIfNeeded(SignalState.R);
    this.buffers.push(Buffer.from('02', 'hex'));
    return this;
  }

  setFanSpeed(speed: Speed) {
    this.setSignalStateIfNeeded(SignalState.RW);
    this.buffers.push(Buffer.from('02', 'hex'));
    this.buffers.push(Buffer.from(speed.toString(), 'hex'));
    return this;
  }

  getDevicesOnLocalNetwork() {
    this.setSignalStateIfNeeded(SignalState.R);
    this.buffers.push(Buffer.from('7c', 'hex'));
    return this;
  }

  getPowerStatus() {
    this.setSignalStateIfNeeded(SignalState.R);
    this.buffers.push(Buffer.from('01', 'hex'));
    return this;
  }

  setPowerStatus(power: Power) {
    this.setSignalStateIfNeeded(SignalState.RW);
    this.buffers.push(Buffer.from('01', 'hex'));
    this.buffers.push(Buffer.from(power.toString(), 'hex'));
    return this;
  }
}
