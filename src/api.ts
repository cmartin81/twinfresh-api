import { FAN_PASSWORD, FAN_SERIAL } from './fanConstants';

const buffers: any[] = [];
buffers.push(Buffer.from('FDFD0210', 'hex')); // start
buffers.push(Buffer.from(FAN_SERIAL)); //serienr
buffers.push(Buffer.from('04', 'hex')); //spacer
buffers.push(Buffer.from(FAN_PASSWORD)); // pin
buffers.push(Buffer.from('030201fc01070b729705', 'hex')); //  kommando
