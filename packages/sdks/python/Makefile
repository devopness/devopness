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
		-t $(IMAGE) .

build-sdk-python: build-image ## Build Python SDK
	$(info Docker - Building Devopness SDK - Python ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--env USER_ID=$(USER_ID) \
		--env USER_NAME=$(USER_NAME) \
		--env GROUP_ID=$(GROUP_ID) \
		--env GROUP_NAME=$(GROUP_NAME) \
		--name devopness-sdk-python-build \
		$(IMAGE):$(TAG) \
		/bin/bash scripts/build.sh

shell: build-image ## Runs shell in development environment
	$(info Starting shell in development environment ...)
	@docker run --rm \
		-it \
		-v $(PWD):/$(WORKDIR) \
		--name devopness-sdk-python-shell \
  	$(IMAGE):$(TAG) \
		/bin/bash

publish-dev: build-sdk-python ## Publish the Devopness SDK - Python to Test PyPI
	$(info Publishing Devopness SDK - Python to Test PyPI ...)
	@docker run --rm \
		-v $(PWD):/$(WORKDIR) \
		--env USER_ID=$(USER_ID) \
		--env USER_NAME=$(USER_NAME) \
		--env GROUP_ID=$(GROUP_ID) \
		--env GROUP_NAME=$(GROUP_NAME) \
		--name devopness-sdk-python-publish-dev \
		$(IMAGE):$(TAG) \
		/bin/bash scripts/publish-dev.sh

help: ## Show this help.
# `help' function obtained from GitHub gist: https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123#gistcomment-4160123
	@echo Devopness SDK - Python
	@awk 'BEGIN {FS = ": .*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+(\\:[$$()% 0-9a-zA-Z_-]+)*:.*?##/ { gsub(/\\:/,":", $$1); printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
