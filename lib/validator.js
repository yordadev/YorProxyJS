const dns = require("dns");
const blacklist = require("./blacklisted.js");

let req_host = "";

exports.validateReqAddress = function validateReqAddress(hostname) {
  for (let host of blacklist.hosts) {
    if (hostname.toString().includes(host)) {
      console.log("[YorProxy] Blocked Host: " + host);
      return false;
    }
  }

  dns.lookup(hostname.toString(), (err, address, family) => {
    console.log("[YorProxy] IP Fetched");
    req_host = address;
    if (err) {
      req_host = hostname.toString(); //IMPROPER HANDLING
    }
  });

  for (let ip of blacklist.ip_addresses) {
    console.log(ip, req_host);
    if (ip === req_host) {
      console.log("[YorProxy] Blocked Host: " + ip);
      return false;
    }
  }

  console.log("[YorProxy] Forwarding ", req_host);
  return true;
};
