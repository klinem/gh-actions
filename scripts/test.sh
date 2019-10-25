# Run Jest tests
# yarn --cwd actions/setup-gitversion build;
# yarn --cwd actions/setup-msbuild build;
# yarn --cwd actions/setup-nuget build;
yarn --cwd actions/setup-gitversion test;
yarn --cwd actions/wait test;