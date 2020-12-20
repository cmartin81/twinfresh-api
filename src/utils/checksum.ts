export const calcChecksum = (buffer: Buffer) => {
  const checksum = buffer.reduce((a, b) => a + b);
  return Buffer.from(checksum.toString(16).padStart(4, '0'), 'hex').reverse();
};
