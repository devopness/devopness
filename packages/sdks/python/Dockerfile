ARG PYTHON_VERSION="3.13"
ARG ALPINE_VERSION="3.21"
FROM python:${PYTHON_VERSION}-alpine${ALPINE_VERSION}

# --- System dependencies installation ---
# bash: every Make target executes shell scripts inside the container.
# openjdk11-jre: the OpenAPI Generator is a Java application. Removing it means
#   `make build-sdk-python` cannot run, and with it both SDKs' generated models.
RUN apk update && apk add --no-cache bash openjdk11-jre

WORKDIR /sdk

# --- Package manager installation ---
# uv replaces poetry. It is installed from the official standalone distribution
# rather than via pip so the image does not carry pip's dependency tree, and so
# the uv version is pinned independently of the Python version.
#
# `UV_INSTALL_DIR` is set to a world-readable prefix because the installer's
# default is `$HOME/.local/bin`, which lands under `/root`. `/root` is mode 700,
# so a symlink pointing into it resolves to nothing for the unprivileged user the
# Make targets run as, and uv appears to be missing. That failure mode is
# indistinguishable from uv not being installed, which is why it is avoided by
# construction rather than discovered later.
ARG UV_VERSION="0.12.1"
ENV UV_INSTALL_DIR=/usr/local/bin
RUN apk add --no-cache curl \
    && curl -LsSf https://astral.sh/uv/${UV_VERSION}/install.sh | sh \
    && rm -rf /root/.cache/* /tmp/* \
    && uv --version

# uv's hardlink store does not work across the overlay filesystems podman and
# Docker use for bind mounts, so copy is the portable choice.
ENV UV_LINK_MODE=copy

# The virtual environment lives outside the bind mount, and the cache lives in
# /tmp.
#
# Every Make target bind-mounts the host package directory over /sdk. A venv at
# the default location, /sdk/.venv, is therefore hidden by that mount at exactly
# the moment it is needed, and uv falls back to trying to create it in a
# directory the unprivileged user may not be able to write. This is the same
# problem `POETRY_VIRTUALENVS_CREATE=false` used to hide, except poetry put its
# packages in the interpreter's site-packages where nothing could shadow them.
#
# Putting the environment and the cache outside the mount makes the container
# self-contained, which is what it should have been all along.
ENV UV_PROJECT_ENVIRONMENT=/opt/sdk-venv
ENV UV_CACHE_DIR=/tmp/uv-cache

# --- Package dependencies installation ---
# `--no-install-project` installs the dependency groups without installing the
# package itself. The package is built later by `make build-sdk-python`, after
# the OpenAPI models have been generated into `src/devopness/generated`, so
# installing it here would bake in a stale tree.
COPY uv.lock pyproject.toml ./
RUN uv sync --locked --no-install-project --no-dev
RUN uv sync --locked --no-install-project

# The build populates the cache as root and the Make targets run as the invoking
# user, so the whole tree has to be opened up *after* the syncs above have
# created their subdirectories. Doing this earlier leaves root-owned
# subdirectories behind and uv fails with a permission error on
# `sdists-v9/.git` that reads like cache corruption rather than a permission
# problem.
#
# The virtual environment needs the same treatment for a different reason: the
# test target runs `uv sync --locked` so the lockfile is genuinely verified at
# test time rather than trusted from the image, and that sync installs the
# project itself. The venv lives in the container, never in the bind mount, so
# the invoking user writing to it affects nothing outside the container.
RUN mkdir -p /tmp/uv-cache \
    && chmod -R a+rwX /tmp/uv-cache /opt/sdk-venv
