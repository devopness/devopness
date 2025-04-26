IMAGE=devopness-sdk-python
TAG?=latest

PWD=$(shell pwd)
USER_ID=$(shell id -u)
USER_NAME=$(shell id -u -n)
GROUP_ID=$(shell id -g)
GROUP_NAME=$(USER_NAME)

WORKDIR=sdk

.DEFAULT_GOAL=help

build-image: ## Build Docker Image. To customize the image, use the PYTHON_VERSION and ALPINE_VERSION args.
	$(info Docker - Building Image ...)
	@docker build \
		-f Dockerfile \
		--build-arg USER_ID=$(USER_ID) \
		--build-arg USER_NAME=$(USER_NAME) \
		--build-arg GROUP_ID=$(GROUP_ID) \
		--build-arg GROUP_NAME=$(GROUP_NAME) \
		$(if $(PYTHON_VERSION),--build-arg PYTHON_VERSION=$(PYTHON_VERSION),) \
		$(if $(ALPINE_VERSION),--build-arg ALPINE_VERSION=$(ALPINE_VERSION),) \
		-t $(IMAGE) .

build-sdk-python: build-image ## Build Python SDK
	$(info Docker - Building Devopness SDK - Python ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-build \
		$(IMAGE):$(TAG) \
		scripts/build.py

publish-dev: build-image ## Publish Devopness SDK - Python to Test PyPI. Requires POETRY_TEST_PYPI_TOKEN.
	$(info Publishing Devopness SDK - Python to Test PyPI ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--env POETRY_TEST_PYPI_TOKEN=$(POETRY_TEST_PYPI_TOKEN) \
		--name devopness-sdk-python-publish-dev \
		$(IMAGE):$(TAG) \
		/bin/bash scripts/publish-dev.sh

shell: build-image ## Runs shell in development environment
	$(info Starting shell in development environment ...)
	@docker run --rm \
		-it \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-shell \
  	$(IMAGE):$(TAG) \
		/bin/bash

lint: build-image ## Run the linting against the SDK.
	$(info Running Devopness SDK - Python Linting ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-lint \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			poetry run ruff check . && \
			poetry run ruff format . --check && \
			poetry run mypy . \
		'

format: build-image ## Run the formatting against the SDK.
	$(info Running Devopness SDK - Python Formatting ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-format \
		$(IMAGE):$(TAG) \
		/bin/bash -cex ' \
			poetry run ruff check --fix && \
			poetry run ruff format .  \
		'

test-unit: build-image ## Run the unit test suite against the SDK.
	$(info Running Devopness SDK - Python Unit Tests ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-tests \
		$(IMAGE):$(TAG) \
		/bin/bash scripts/test-unit.sh

help: ## Show this help.
# `help' function obtained from GitHub gist: https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123#gistcomment-4160123
	@echo Devopness SDK - Python
	@awk 'BEGIN {FS = ": .*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+(\\:[$$()% 0-9a-zA-Z_-]+)*:.*?##/ { gsub(/\\:/,":", $$1); printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
