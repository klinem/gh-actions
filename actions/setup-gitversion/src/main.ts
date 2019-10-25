import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { GitVersionInstaller } from './installer';

async function run() {
  try {
    const version = core.getInput('version');

    const installer = new GitVersionInstaller(version);
    await installer.install();

    let output = '';
    exec.exec('dotnet-gitversion', ['/output', 'json'], {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString();
        },
      },
    });

    core.info(output);

    const gitVersionResult: { [key: string]: string } = JSON.parse(output);
    for (const key in gitVersionResult) {
      core.exportVariable(`GITVERSION_${key}`, gitVersionResult[key]);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
