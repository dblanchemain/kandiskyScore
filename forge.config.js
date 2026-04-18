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
      config: {
        name: 'kandiskyScore',
        authors: 'D.Blanchemain',
        description: 'kandiskyScore — compositeur de partitions spatiales',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux','win32'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'kandiskyScore',
        format: 'ULFO',
      },
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
    prePackage: async () => {
      const platform = process.platform;
      const root     = path.resolve(__dirname);

      // Linux : pas de PyInstaller — PortAudio charge libjack.so dynamiquement,
      // incompatible avec un binaire one-file isolé. Le fallback audio_server.py
      // (Python système) fonctionne parfaitement avec JACK/PulseAudio/PipeWire.
      if (platform === 'linux') {
        console.log('ℹ️  Linux : fallback audio_server.py (Python système), pas de PyInstaller.');
        return;
      }

      const binMap = {
        darwin: { dest: path.join(root, 'resources', 'bin', 'mac', 'audio_server'),       ext: '',     py: 'python3' },
        win32:  { dest: path.join(root, 'resources', 'bin', 'win', 'audio_server.exe'),   ext: '.exe', py: 'python'  },
      };
      const entry = binMap[platform];
      if (!entry) return;

      if (fs.existsSync(entry.dest)) {
        console.log('✓ audio_server déjà compilé, build ignoré.');
        return;
      }

      console.log('▶ Compilation audio_server via PyInstaller...');
      try {
        execSync(`${entry.py} -m PyInstaller audio_server.spec`, { stdio: 'inherit', cwd: root });
        fs.mkdirSync(path.dirname(entry.dest), { recursive: true });
        fs.copyFileSync(path.join(root, 'dist', `audio_server${entry.ext}`), entry.dest);
        if (platform !== 'win32') fs.chmodSync(entry.dest, 0o755);
        console.log(`✅ audio_server compilé → ${entry.dest}`);
      } catch (err) {
        console.warn(`⚠️  PyInstaller échoué, fallback audio_server.py : ${err.message}`);
      }
    },
  },
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
