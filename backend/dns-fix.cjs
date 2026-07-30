// dns-fix.cjs
// Preload this file to force Node's DNS resolver to use Google DNS.
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
console.log('dns-fix: set DNS servers to', require('dns').getServers());
