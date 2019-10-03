const os = require("os");

module.exports = function() {
  let interfaces;
  const UV_INTERFACE_ADDRESSES = "uv_interface_addresses";

  try {
    interfaces = os.networkInterfaces();
  } catch (e) {
    // As of October 2016, Windows Subsystem for Linux (WSL) does not support
    // the os.networkInterfaces() call and throws instead. For this platform,
    // assume we are online.
    if (e.syscall === UV_INTERFACE_ADDRESSES) {
      return true;
    } else {
      throw e;
    }
  }

  function isNotLocalhost(interface) {
    return "lo" !== interface ? true : false;
  }

  // Check if tunneling (probably cjdns)
  function isNotTunneling(interface) {
    return !/^tun\d+$/.test(interface) ? true : false;
  }

  for (let interface in interfaces) {
    return isNotLocalhost(interface) && isNotTunneling(interface);
  }
  return false;
};

if (!module.parent && process.title === "node") {
  const currentModule = module.exports();
  console.error(currentModule);

  //exit non-zero if not online
  process.exit((1 - currentModule) & 1);
}
