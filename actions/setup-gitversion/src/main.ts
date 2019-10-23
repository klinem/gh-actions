import * as core from '@actions/core';
import { GitVersionInstaller } from './installer';

async function run() {
  try {
    const version = core.getInput('version');

    const installer = new GitVersionInstaller(version);
    await installer.install();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
