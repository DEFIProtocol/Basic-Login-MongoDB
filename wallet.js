const bitcore = require('bitcore-lib')

const rand_buffer = bitcore.crypto.getRandomBuffer(32);
const rand_number = bitcore.crypto.BN.fromBuffer(rand_buffer);


const address = () => {
    const address = new bitcore.PrivateKey(rand_number).toAddress('testnet')
    return address;
}

module.exports = address;
