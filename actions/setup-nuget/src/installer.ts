import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

export class NuGetInstaller {
  private readonly cachedToolName = 'nuget';
  private readonly downloadUrlTmpl = 'https://dist.nuget.org/win-x86-commandline/{version}/nuget.exe';

  constructor(private readonly version: string) {}

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
    const downloadUrl = this.downloadUrlTmpl.replace('{version}', this.version === 'latest' ? 'latest' : `v${this.version}`);

    core.debug(`Downloading NuGet from ${downloadUrl}`);
    const nugetPath = await toolCache.downloadTool(downloadUrl);
    const nugetPathDir = path.dirname(nugetPath);
    // Rename to work around https://github.com/actions/toolkit/issues/60
    fs.renameSync(nugetPath, path.join(nugetPathDir, 'nuget.exe'));

    core.debug('Caching tool');
    const cachedDir = await toolCache.cacheDir(nugetPathDir, this.cachedToolName, this.version);

    return cachedDir;
  }
}
