#!/bin/sh

# Overwrite old node_modules
cp -rf /tmp/node_modules /nodesample
rm -rf /tmp/node_modules

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
