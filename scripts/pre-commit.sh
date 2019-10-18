# Run prettier over the repo
yarn pretty-quick;

# Build action bundles.
yarn --cwd actions/setup-nuget build;
yarn --cwd actions/wait build;
git add **/bundle.js