# GitHub Actions Matrix Configurations

This directory contains configuration files shared across multiple GitHub Actions workflows.
Keep in this README a brief description of each file, as some file formats do not accept code comments (e.g. `.json`).

## python-packages.json

Defines the Python/Pypi packages managed in this repository. Used by:
- `release-packages.yml` - Publishes packages to PyPI
- `sync-package-versions.yml` - Syncs versions between package.json and pyproject.toml

### Schema

Each entry in the array represents a Python package with the following fields:

- `name` (string): Human-readable package name for display in workflow logs
- `path` (string): Relative path from repository root to the package directory
- `pypi_name` (string): The package name on PyPI (used for version checking)
- `post_version_sync_commands` (string): Optional bash commands to run after version sync

### Adding a new package to the matrix

1. Add a new entry to `python-packages.json`:
   ```json
   {
     "name": "Your Package Name",
     "path": "packages/your-package",
     "pypi_name": "your-package-name",
     "post_version_sync_commands": ""
   }
   ```
2. Commit the changes
3. The workflows will automatically include the new package in their matrix in their `load-*` jobs
