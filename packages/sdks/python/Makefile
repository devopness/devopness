IMAGE=devopness-sdk-python
TAG?=latest

PWD=$(shell pwd)
USER_ID=$(shell id -u)
USER_NAME=$(shell id -u -n)
GROUP_ID=$(shell id -g)
GROUP_NAME=$(USER_NAME)

WORKDIR=sdk

.DEFAULT_GOAL=help

build-image: ## Build Docker Image
	$(info Docker - Building Image ...)
	@docker build \
		-f Dockerfile \
		--build-arg USER_ID=$(USER_ID) \
		--build-arg USER_NAME=$(USER_NAME) \
		--build-arg GROUP_ID=$(GROUP_ID) \
		--build-arg GROUP_NAME=$(GROUP_NAME) \
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

test: build-image ## Run the test suite against the SDK. e.g.: `make test ARGS="-vv -s"`
	$(info Running Tests with $(if $(ARGS),"$(ARGS)","-v") as args...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-tests \
		--env PYTEST_ARGS="$(if $(ARGS),$(ARGS),-v)" \
		$(IMAGE):$(TAG) \
		/bin/bash scripts/test.sh

help: ## Show this help.
# `help' function obtained from GitHub gist: https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123#gistcomment-4160123
	@echo Devopness SDK - Python
	@awk 'BEGIN {FS = ": .*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+(\\:[$$()% 0-9a-zA-Z_-]+)*:.*?##/ { gsub(/\\:/,":", $$1); printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
