IMAGE ?= devopness-sdk-python
TAG ?= latest

# Container engine is a variable, not a hardcoded `docker`.
#
# Docker is not available in every development environment, and a Makefile that
# only speaks one engine is a Makefile that cannot be run at all on some
# machines. Podman is the default because it is rootless and needs no daemon;
# override with `CONTAINER_ENGINE=docker` where Docker is the one installed.
CONTAINER_ENGINE ?= $(shell command -v podman >/dev/null 2>&1 && echo podman || echo docker)

# Identity flags differ by engine, and getting this wrong fails in a way that
# looks like a broken bind mount rather than a broken user mapping.
#
# Rootful Docker has no user namespace, so passing `-u <uid>:<gid>` through is
# both necessary and sufficient.
#
# Rootless podman always runs in a user namespace, where container root maps to
# the invoking host user. Passing `-u $(USER_ID)` there asks for container uid
# 1000, which maps to a subordinate uid that owns nothing in the bind mount, so
# every write fails with EACCES even though the files are owned by the invoking
# user. `--userns=keep-id` maps the invoking user to the same uid inside, which
# is what rootless podman is designed for.
ifeq ($(CONTAINER_ENGINE),podman)
IDENTITY_FLAGS := --userns=keep-id
else
IDENTITY_FLAGS := -u $(USER_ID):$(GROUP_ID)
endif

PWD := $(shell pwd)
USER_ID := $(shell id -u)
GROUP_ID := $(shell id -g)

WORKDIR := sdk

.DEFAULT_GOAL := help
.PHONY: build-image shell build-sdk-python publish lint format test-unit help

##@ Container

build-image: ## 🔧 Build the container image (optional: PYTHON_VERSION / ALPINE_VERSION)
	$(info 🐳 Building container image with $(CONTAINER_ENGINE)...)
	@$(CONTAINER_ENGINE) build \
		-f Dockerfile \
		$(if $(PYTHON_VERSION),--build-arg PYTHON_VERSION=$(PYTHON_VERSION),) \
		$(if $(ALPINE_VERSION),--build-arg ALPINE_VERSION=$(ALPINE_VERSION),) \
		-t $(IMAGE):$(TAG) .

shell: build-image ## 🐚 Open a shell inside the SDK container
	$(info 🔧 Starting interactive shell in SDK container...)
	@$(CONTAINER_ENGINE) run --rm -it \
		$(IDENTITY_FLAGS) \
		-v $(PWD):/$(WORKDIR) \
		-v $(PWD)/../common:/common \
		--name devopness-sdk-python-shell \
		$(IMAGE):$(TAG) \
		/bin/bash

##@ SDK Build & Publish

build-sdk-python: build-image ## ⚙️  Build the Devopness SDK for Python
	$(info 🏗️  Building SDK using Docker...)
	@$(CONTAINER_ENGINE) run --rm \
		$(IDENTITY_FLAGS) \
		-v $(PWD):/$(WORKDIR) \
		-v $(PWD)/../common:/common \
		--name devopness-sdk-python-build \
		$(IMAGE):$(TAG) \
		/bin/bash -ce ' \
			GENERATED_FILES=src/devopness/generated; \
			SDK_MODELS_FILE=src/devopness/models.py; \
			FILES_TO_FORMAT="$$GENERATED_FILES $$SDK_MODELS_FILE"; \
			\
			uv run --no-sync python scripts/build.py; \
			\
			echo "🔧  Formatting generated files..."; \
			uv run --no-sync ruff check --fix --select I  -s $$FILES_TO_FORMAT; \
			uv run --no-sync ruff check --fix --exit-zero -s $$FILES_TO_FORMAT; \
			uv run --no-sync ruff format                  -s $$FILES_TO_FORMAT; \
			\
			echo "✅  Devopness SDK - Python Build Completed"; \
		'


package-sdk-python: build-sdk-python ## 📦 Package the Devopness SDK for Python (output in 'dist/')
	$(info 📦 Packaging Devopness SDK using uv build...)
	@$(CONTAINER_ENGINE) run --rm \
		$(IDENTITY_FLAGS) \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-dist \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			uv build; \
		'

##@ Lint & Format

lint: build-image ## 🔍 Run linting tools (ruff, mypy)
	$(info 🧹 Running linters...)
	@$(CONTAINER_ENGINE) run --rm \
		$(IDENTITY_FLAGS) \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-lint \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			uv run --no-sync ruff check . && \
			uv run --no-sync ruff format . --check && \
			uv run --no-sync mypy --enable-error-code exhaustive-match . \
		'

format: build-image ## 🧼 Auto-format code with ruff
	$(info ✨ Formatting code...)
	@$(CONTAINER_ENGINE) run --rm \
		$(IDENTITY_FLAGS) \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-format \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			uv run --no-sync ruff check --fix && \
			uv run --no-sync ruff format . \
		'

##@ Tests

test-unit: build-image ## 🧪 Run unit tests
	$(info 🧪 Running unit tests...)
	@$(CONTAINER_ENGINE) run --rm \
		$(IDENTITY_FLAGS) \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-tests \
		$(IMAGE):$(TAG) \
		/bin/bash scripts/test-unit.sh

##@ Utilities

help: ## 📖 Show this help message
# `help` function obtained from https://gist.github.com/prwhite/8168133#gistcomment-4160123
	@echo "Devopness SDK - Python"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} \
	/^[a-zA-Z0-9_-]+:.*##/ { \
		printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 \
	}' $(MAKEFILE_LIST)
