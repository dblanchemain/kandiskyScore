const fs = require('fs');

const allResources = ["resources/bin","resources/Dsp","resources/@grame","resources/images","resources/Scripts"];
const extraResource = allResources.filter(p => fs.existsSync(p));

module.exports = {
  packagerConfig: {
    asar: true,
    extraResource
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin','linux','win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
