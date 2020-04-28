import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { DotNetCoreToolInstaller } from 'utils';

async function run() {
  try {
    const version = core.getInput('version');

    const installer = new DotNetCoreToolInstaller('Octopus.DotNet.Cli');
    await installer.install(version);

    // const installer = new GitVersionInstaller(version);
    // await installer.install();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
