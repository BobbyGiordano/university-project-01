const app = require('./app');
const { PORT, HOST } = require('./config');
const os = require('os');

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

const server = app.listen(PORT, HOST, () => {
  const localIps = getLocalIpAddresses();
  console.log('====================================================');
  console.log('🚀 Hex Titanium Bolt Specification Web System');
  console.log(`📍 Server lokal aktif di: http://localhost:${PORT}`);
  if (localIps.length > 0) {
    console.log('📱 Akses dari smartphone staf / kasir via Wi-Fi toko:');
    localIps.forEach((ip) => {
      console.log(`   👉 http://${ip}:${PORT}`);
    });
  }
  console.log('====================================================');
});

module.exports = server;

