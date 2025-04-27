IMAGE=devopness-sdk-js
TAG?=latest
PWD=$(shell pwd)
WORKDIR=sdk

.PHONY:	all build-image

all:	build-image

build-image: ## Build Docker Image
	$(info Docker - Building Image ...)
	@docker build -f Dockerfile-dev -t $(IMAGE):$(TAG) .

build-sdk-js: build-image npm-ci ## Build Javascript SDK
	$(info Docker - Building Javascript SDK ...)
	@docker run --rm \
	-v $(PWD):/$(WORKDIR) \
	-v $(PWD)/../common:/common \
	--name devopness-sdk-js-build \
	$(IMAGE):$(TAG) \
	npm run build

help: ## Show this help.
# `help' function obtained from GitHub gist: https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123#gistcomment-4160123
	@echo Devopness SDK - Javascript
	@awk 'BEGIN {FS = ": .*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+(\\:[$$()% 0-9a-zA-Z_-]+)*:.*?##/ { gsub(/\\:/,":", $$1); printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

npm: ## Run npm with the provided ARGS. e.g.: `make npm`, `make npm ARGS=version`, `make npm ARGS="run lint"`
	$(info npm - Running npm $(ARGS)...)
	@docker run --rm \
	-v $(PWD):/$(WORKDIR) \
	--name devopness-sdk-js-npm \
	-it $(IMAGE):$(TAG) \
	npm $(ARGS)

npm-ci: ## Install project dependencies without updating `package-lock.json`
	$(info NPM - Installing dependencies ...)
	@docker run --rm \
	-v $(PWD):/$(WORKDIR) \
	--name devopness-sdk-js-npm-ci \
	$(IMAGE):$(TAG) \
	npm ci

npm-install: ## Install project dependencies and update `package-lock.json`
	$(info NPM - Installing dependencies ...)
	@docker run --rm \
	-v $(PWD):/$(WORKDIR) \
	--name devopness-sdk-js-npm-install \
	$(IMAGE):$(TAG) \
	npm install

test: ## Run tests
	$(info NPM - Running Tests ...)
	@docker run --rm \
	-v $(PWD):/$(WORKDIR) \
	--name devopness-sdk-js-tests \
	$(IMAGE):$(TAG) \
	npm run test

.DEFAULT_GOAL=help
