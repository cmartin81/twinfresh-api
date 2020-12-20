import { SignalFactory } from './utils/signalFactory';
import { calcChecksum } from './utils/checksum';
import { parseSignal } from './utils/signalParser';
import { FAN_PASSWORD, FAN_SERIAL } from './fanConstants';

const dgram = require('dgram');

export class Fan {
  constructor(
    public serialnr = '',
    public password = FAN_PASSWORD,
    public ipAddress: string,
  ) {}

  async sendSignalToFan(buffer: Buffer) {
    const client = dgram.createSocket('udp4');
    client.on('listening', function(err: any) {
      console.log('listening');
    });

    client.on('error', function(err: any) {
      console.log('ERROR!');
      console.log(err.message);
    });

    client.on('message', function(msg: any, info: any) {
      console.log('msg received');
      // parseResponse(msg);
      console.log(msg.toString('hex'));
    });
    client.bind(4000);
    console.log('sending to ' + this.ipAddress);
    client.send(buffer, 4000, this.ipAddress, (a: any, c: any) => {
      console.log(a);
      console.log(c);
    });
    console.log('sendt');
    client.close();
    console.log('-1-');

    await this.s();
    console.log('--');
    return '123';
  }

  s() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  signalBuilder() {
    return new SignalFactory(this.serialnr, this.password);
  }
  static async send(buffer: Buffer) {
    const tempClient = dgram.createSocket('udp4');

    const posibleFanIpAdr: string[] = [];
    async function getMyIp() {
      return new Promise(resolve => {
        require('dns').lookup(require('os').hostname(), function(
          err: any,
          add: String,
          fam: number,
        ) {
          resolve(add);
        });
      });
    }

    let discoverSignal: Buffer = new SignalFactory(FAN_SERIAL, FAN_PASSWORD)
      .getDevicesOnLocalNetwork()
      .buildSignal();
    console.log(discoverSignal.toString('hex'));
    tempClient.on('message', function(msg: any, info: any) {
      posibleFanIpAdr.push(info.address);
      console.log(msg);
      console.log(parseSignal(msg));
      console.log(msg.toString('hex'));
    });

    tempClient.bind(4000);

    const myIp = (await getMyIp()) as string; //ip of homey
    const myIpArr: any[] = myIp.split('.');
    const lastIpPosition = parseInt(myIpArr.pop());
    const ipPrefix = myIpArr.join('.') + '.';

    for (let i = 1; i < 255; i++) {
      if (i === lastIpPosition) {
        continue;
      }
      tempClient.send(buffer, 4000, ipPrefix + i);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    tempClient.close();
    return posibleFanIpAdr;
  }

  static async discoverFans() {
    const tempClient = dgram.createSocket('udp4');

    const posibleFanIpAdr: string[] = [];
    async function getMyIp() {
      return new Promise(resolve => {
        require('dns').lookup(require('os').hostname(), function(
          err: any,
          add: String,
          fam: number,
        ) {
          resolve(add);
        });
      });
    }

    let discoverSignal: Buffer = new SignalFactory(FAN_SERIAL, FAN_PASSWORD)
      .getDevicesOnLocalNetwork()
      .buildSignal();
    console.log(discoverSignal.toString('hex'));
    tempClient.on('message', function(msg: any, info: any) {
      posibleFanIpAdr.push(info.address);
      // console.log(msg);
      console.log(parseSignal(msg));
      console.log(msg.toString('hex'));
    });

    tempClient.bind(4000);

    const myIp = (await getMyIp()) as string;
    const myIpArr: any[] = myIp.split('.');
    const lastIpPosition = parseInt(myIpArr.pop());
    const ipPrefix = myIpArr.join('.') + '.';

    for (let i = 1; i < 255; i++) {
      if (i === lastIpPosition) {
        continue;
      }
      tempClient.send(discoverSignal, 4000, ipPrefix + i);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    tempClient.close();
    return posibleFanIpAdr;
  }
}
