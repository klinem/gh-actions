import * as io from '@actions/io';
import * as path from 'path';
import * as cp from 'child_process';

const TOOL_DIR = (process.env['RUNNER_TOOL_CACHE'] = path.join(__dirname, 'runner', 'tools'));
const TEMP_DIR = (process.env['RUNNER_TEMP'] = path.join(__dirname, 'runner', 'temp'));

const clearTempDirs = async () => {
  await io.rmRF(TEMP_DIR);
  await io.rmRF(TOOL_DIR);
};

describe('main', () => {
  beforeAll(async () => await clearTempDirs());

  afterAll(async () => await clearTempDirs());

  test('runs', () => {
    process.env['INPUT_VERSION'] = 'latest';
    const ip = path.join(__dirname, '..', 'lib', 'bundle.js');
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log(cp.execSync(`node ${ip}`, options).toString());
  });
});
