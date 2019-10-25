import * as io from '@actions/io';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const TOOL_DIR = (process.env['RUNNER_TOOL_CACHE'] = path.join(__dirname, 'runner', 'tools'));
const TEMP_DIR = (process.env['RUNNER_TEMP'] = path.join(__dirname, 'runner', 'temp'));

import { GitVersionInstaller } from '../src/installer';

const IS_WINDOWS = process.platform === 'win32';

const clearTempDirs = async () => {
  await io.rmRF(TEMP_DIR);
  await io.rmRF(TOOL_DIR);
};

describe('installer tests', () => {
  beforeAll(async () => {
    await clearTempDirs();
  });

  afterAll(async () => {
    await clearTempDirs();
  });

  test.each(['3.0.0', 'latest'])(
    'installs gitversion (%s)',
    async version => {
      const installer = new GitVersionInstaller(version);
      await installer.install();

      const toolPath = path.join(TOOL_DIR, 'gitversion', version, os.arch());

      expect(fs.existsSync(`${toolPath}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(toolPath, 'dotnet-gitversion.exe'))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(toolPath, 'dotnet-gitversion'))).toBe(true);
      }
    },
    100000,
  );

  test('uses cached tool', async () => {
    const toolPath = path.join(TOOL_DIR, 'gitversion', '100.0.0', os.arch());
    await io.mkdirP(toolPath);
    fs.writeFileSync(`${toolPath}.complete`, 'test');

    const installer = new GitVersionInstaller('100.0.0');
    // Throws if version not cached as version does not exist
    await installer.install();
  }, 100000);
});
