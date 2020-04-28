let tempDirectory = process.env['RUNNER_TEMP'] || '';
import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as os from 'os';

const IS_WINDOWS = process.platform === 'win32';

if (!tempDirectory) {
  let baseLocation;
  if (IS_WINDOWS) {
    // On windows use the USERPROFILE env variable
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export class DotNetCoreToolInstaller {
  constructor(private readonly toolName: string, private readonly toolAlias?: string) {}

  /**
   * Installs the .NET core tool.
   */
  async install(version: string = 'latest') {
    let toolPath = this.getCachedToolPath(version);
    if (!toolPath) {
      toolPath = await this.downloadTool(version);
    }

    core.addPath(toolPath);
  }

  private getCachedToolPath(version: string): string {
    core.debug('Checking tool cache');
    return toolCache.find(this.toolName, version);
  }

  private async downloadTool(version: string): Promise<string> {
    var toolDir = path.join(tempDirectory, this.toolName, version);
    var installArgs = ['tool', 'install', this.toolName, '--tool-path', toolDir];

    if (version !== 'latest') {
      installArgs.push('--version', version);
    }

    core.debug(`Installing GitVersion tool`);
    await exec.exec('dotnet', installArgs);

    core.debug('Caching tool');
    const cachedDir = await toolCache.cacheDir(toolDir, this.toolName, version);

    return cachedDir;
  }
}
