IMAGE ?= devopness-sdk-python
TAG ?= latest

PWD := $(shell pwd)
USER_ID := $(shell id -u)
GROUP_ID := $(shell id -g)

WORKDIR := sdk

.DEFAULT_GOAL := help
.PHONY: build-image shell build-sdk-python publish publish-dev lint format test-unit help

##@ Docker

build-image: ## 🔧 Build the Docker image (optional: PYTHON_VERSION / ALPINE_VERSION)
	$(info 🐳 Building Docker image...)
	@docker build \
		-f Dockerfile \
		$(if $(PYTHON_VERSION),--build-arg PYTHON_VERSION=$(PYTHON_VERSION),) \
		$(if $(ALPINE_VERSION),--build-arg ALPINE_VERSION=$(ALPINE_VERSION),) \
		-t $(IMAGE):$(TAG) .

shell: build-image ## 🐚 Open a shell inside the SDK container
	$(info 🔧 Starting interactive shell in SDK container...)
	@docker run --rm -it \
		-v $(PWD):/$(WORKDIR) \
		-v $(PWD)/../common:/common \
		--name devopness-sdk-python-shell \
		$(IMAGE):$(TAG) \
		/bin/bash

##@ SDK Build & Publish

build-sdk-python: build-image ## ⚙️  Build the Devopness SDK for Python
	$(info 🏗️  Building SDK using Docker...)
	@docker run --rm \
		-u $(USER_ID):$(GROUP_ID) \
		-v $(PWD):/$(WORKDIR) \
		-v $(PWD)/../common:/common \
		--name devopness-sdk-python-build \
		$(IMAGE):$(TAG) \
		scripts/build.py

publish: build-image ## 🚀 Publish the SDK to PyPI (requires PYPI_TOKEN)
	$(info 📦  Publishing SDK to PyPI...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--env DEVOPNESS_SDK_PYTHON_PYPI_TOKEN=$(PYPI_TOKEN) \
		--name devopness-sdk-python-publish \
		$(IMAGE):$(TAG) \
		/bin/bash -ce ' \
		  rm -rf dist; \
			VERSION=$$(poetry version --short); \
			poetry config pypi-token.pypi "$$DEVOPNESS_SDK_PYTHON_PYPI_TOKEN" &> /dev/null; \
			set +e; \
			OUTPUT=$$(poetry publish --build 2>&1); \
			EXIT_CODE=$$?; \
			set -e; \
			if [ $$EXIT_CODE -ne 0 ]; then \
				if echo "$$OUTPUT" | grep -q "File already exists"; then \
					echo "⚠️  Package version $$VERSION already exists on PyPI."; \
				else \
					echo "$$OUTPUT"; \
					exit $$EXIT_CODE; \
				fi; \
			else \
				echo "✅  Successfully published version $$VERSION to PyPI!"; \
				echo "🔗  https://pypi.org/project/devopness/$$VERSION/"; \
			fi'

##@ Lint & Format

lint: build-image ## 🔍 Run linting tools (ruff, mypy)
	$(info 🧹 Running linters...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-lint \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			poetry run ruff check . && \
			poetry run ruff format . --check && \
			poetry run mypy . \
		'

format: build-image ## 🧼 Auto-format code with ruff
	$(info ✨ Formatting code...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-format \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			poetry run ruff check --fix && \
			poetry run ruff format . \
		'

##@ Tests

test-unit: build-image ## 🧪 Run unit tests
	$(info 🧪 Running unit tests...)
	@docker run --rm \
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
