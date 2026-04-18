const fs             = require('fs');
const path           = require('path');
const { execSync }   = require('child_process');

const allResources = ["resources/bin","resources/Dsp","resources/@grame","resources/images","resources/Scripts","resources/Themes","Wam2"];
// audio_server.py doit être hors du asar pour pouvoir être spawn()é en prod
const rootFiles = ["audio_server.py"].filter(p => fs.existsSync(p));
const extraResource = [...allResources.filter(p => fs.existsSync(p)), ...rootFiles];

module.exports = {
  packagerConfig: {
    asar: {
      unpackDir: path.join('**', 'node_modules', 'h5wasm'),
    },
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
  hooks: {
    preMake: async () => {
      const platform = process.platform;

      if (platform === 'win32') {
        // Windows : Python Embeddable + audio_server.py (pas PyInstaller)
        const pythonExe = 'resources/bin/win/python/python.exe';
        if (fs.existsSync(pythonExe)) {
          console.log('✓ Python embeddable déjà présent, setup ignoré.');
        } else {
          console.log('▶ Installation Python Embeddable (Windows)...');
          execSync(
            'powershell -ExecutionPolicy Bypass -File scripts\\setup-python-win.ps1',
            { stdio: 'inherit' }
          );
        }
        return;
      }

      // Linux / macOS : binaire PyInstaller autonome
      const binMap = {
        linux:  'resources/bin/linux/audio_server',
        darwin: 'resources/bin/mac/audio_server',
      };
      const dest = binMap[platform];
      if (!dest) return;
      if (fs.existsSync(dest)) {
        console.log('✓ audio_server déjà compilé, build ignoré.');
        return;
      }
      console.log('▶ Compilation audio_server via PyInstaller...');
      execSync('python3 -m PyInstaller audio_server.spec', { stdio: 'inherit' });
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync('dist/audio_server', dest);
      fs.chmodSync(dest, 0o755);
      console.log(`✅ audio_server compilé → ${dest}`);
    },
  },
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
