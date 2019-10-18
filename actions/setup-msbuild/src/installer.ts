import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as toolCache from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

export class MSBuildInstaller {
  private readonly vsWhereCachedToolName = 'vswhere';
  private readonly vsWhereVersion = '2.7.1';
  private readonly vsWhereDownloadUrl = `https://github.com/microsoft/vswhere/releases/download/${this.vsWhereVersion}/vswhere.exe`;

  constructor() {}

  async install() {
    if (process.platform !== 'win32') {
      throw `MSBuild is not supported on this platform (${process.platform}).`;
    }

    const vsWherePath = await this.installVSWhere();
    const msBuildToolPath = await this.findMSBuild(vsWherePath);

    core.addPath(msBuildToolPath);
  }

  private async installVSWhere() {
    let vsWhereToolPath = this.getCachedVSWhereToolPath();
    if (!vsWhereToolPath) {
      vsWhereToolPath = await this.downloadAndInstallVSWhere();
    }

    core.addPath(vsWhereToolPath);
    return path.join(vsWhereToolPath, 'vswhere.exe');
  }

  private getCachedVSWhereToolPath(): string {
    core.debug('Checking tool cache');
    return toolCache.find(this.vsWhereCachedToolName, this.vsWhereVersion);
  }

  private async downloadAndInstallVSWhere(): Promise<string> {
    core.debug(`Downloading VSWhere from ${this.vsWhereDownloadUrl}`);
    const vsWherePath = await toolCache.downloadTool(this.vsWhereDownloadUrl);
    const vsWherePathDir = path.dirname(vsWherePath);
    // Rename to work around https://github.com/actions/toolkit/issues/60
    fs.renameSync(vsWherePath, path.join(vsWherePathDir, 'vswhere.exe'));

    core.debug('Caching tool');
    const cachedDir = await toolCache.cacheDir(vsWherePathDir, this.vsWhereCachedToolName, this.vsWhereVersion);

    return cachedDir;
  }

  private async findMSBuild(vsWherePath: string) {
    let msBuildPath: string = '';

    await exec.exec(vsWherePath, ['-latest', '-find', '**\\Bin\\MSbuid.exe'], {
      listeners: {
        stdout: (data: Buffer) => {
          msBuildPath += data.toString();
        },
      },
    });

    if (msBuildPath === '') {
      throw 'Unable to find MSBuild.exe';
    }

    core.debug(`MSBuild located at ${msBuildPath}`);

    return path.dirname(msBuildPath);
  }
}
