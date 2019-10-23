# Run prettier over the repo
yarn pretty-quick;

# Build action bundles.
yarn --cwd actions/setup-gitversion build;
yarn --cwd actions/setup-msbuild build;
yarn --cwd actions/setup-nuget build;
yarn --cwd actions/wait build;
git add **/bundle.js