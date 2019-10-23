import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as os from 'os';

export class GitVersionInstaller {
  private readonly cachedToolName = 'gitversion';

  constructor(private readonly version: string = 'latest') {}

  async install() {
    if (process.platform !== 'win32') {
      throw `NuGet is not supported on this platform (${process.platform}).`;
    }

    let toolPath = this.getCachedToolPath();
    if (!toolPath) {
      toolPath = await this.downloadAndInstall();
    }

    core.addPath(toolPath);
  }

  private getCachedToolPath(): string {
    core.debug('Checking tool cache');
    return toolCache.find(this.cachedToolName, this.version);
  }

  private async downloadAndInstall(): Promise<string> {
    var toolDir = path.join(os.tmpdir(), 'GitVerison');
    var installArgs = ['tool', 'install', 'GitVersion.Tool', '--tool-path', toolDir];

    if (this.version && this.version !== 'latest') {
      installArgs.push('--version', this.version);
    }

    core.debug(`Installing GitVersion tool`);
    await exec.exec('dotnet', installArgs);

    core.debug('Caching tool');
    const cachedDir = await toolCache.cacheDir(toolDir, this.cachedToolName, this.version);

    return cachedDir;
  }
}
