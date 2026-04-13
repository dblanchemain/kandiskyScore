const fs = require('fs');

const allResources = ["resources/bin","resources/Dsp","resources/@grame","resources/images","resources/Scripts","resources/Themes","Wam2"];
const extraResource = allResources.filter(p => fs.existsSync(p));

module.exports = {
  packagerConfig: {
    asar: true,
    asarUnpack: [
      '**/node_modules/h5wasm/**',
    ],
    extraResource,
    ignore: [
      /^\/public\/emsdk/,
      /^\/public\/.*\.(cpp|cpp~|h)$/,
      /^\/out\//,
      /^\/\.git\//,
      /^\/Wam2\//,
    ]
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
