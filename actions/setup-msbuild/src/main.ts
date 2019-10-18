import * as core from '@actions/core';
import { MSBuildInstaller } from './installer';

async function run() {
  try {
    const installer = new MSBuildInstaller();
    await installer.install();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
