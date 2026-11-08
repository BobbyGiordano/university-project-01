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
  console.log('\n====================================================');
  console.log('🚀 Hex Titanium Bolt Specification Web System');
  console.log('====================================================');
  console.log(`  ➜  Local UI:    http://localhost:${PORT}/`);
  console.log(`  ➜  Backend API: http://localhost:${PORT}/api`);
  console.log(`  ➜  Backend Port: ${PORT}`);
  if (localIps.length > 0) {
    console.log('  📱 Akses LAN / Wi-Fi Toko:');
    localIps.forEach((ip) => {
      console.log(`     👉 http://${ip}:${PORT}/`);
    });
  }
  console.log('====================================================\n');
});

module.exports = server;

