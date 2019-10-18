import * as core from '@actions/core';
import { NuGetInstaller } from './installer';

async function run() {
  try {
    const version = core.getInput('version');

    const installer = new NuGetInstaller(version);
    await installer.install();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
