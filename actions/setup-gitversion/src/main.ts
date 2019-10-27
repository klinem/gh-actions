import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { GitVersionInstaller } from './installer';

async function run() {
  try {
    const version = core.getInput('version');

    const installer = new GitVersionInstaller(version);
    await installer.install();

    let output = '';
    let error = '';
    await exec.exec('dotnet-gitversion', ['/output', 'json'], {
      silent: true,
      listeners: {
        stderr: (data: Buffer) => {
          error += data.toString();
        },
        stdout: (data: Buffer) => {
          output += data.toString();
        },
      },
    });

    if (!!error) {
      throw error;
    }

    const gitVersionJson: { [key: string]: string } = JSON.parse(output);
    for (const key in gitVersionJson) {
      core.exportVariable(`GITVERSION_${key}`, gitVersionJson[key]);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
