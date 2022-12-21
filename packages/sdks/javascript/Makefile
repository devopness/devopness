IMAGE=devopness-sdk-js
TAG?=latest
PWD=$(shell pwd)

.PHONY:	all build-docker-image

all:	build-docker-image

help: ## Show this help.
# `help' function obtained from GitHub gist: https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123#gistcomment-4160123
	@echo Devopness SDK - Javascript
	@awk 'BEGIN {FS = ": .*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+(\\:[$$()% 0-9a-zA-Z_-]+)*:.*?##/ { gsub(/\\:/,":", $$1); printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.DEFAULT_GOAL=help

npm-install: ## Install project dependencies
	$(info NPM - Installing dependencies ...)
	@docker run --rm -v $(PWD):/api --name npm_install $(IMAGE):$(TAG) npm install

build-docker-img: ## Build Docker Image
	$(info Docker - Building Image ...)
	@docker build -f Dockerfile-dev -t $(IMAGE):$(TAG) .

build-sdk-js: build-docker-img npm-install ## Build Javascript SDK
	$(info Docker - Building Javascript SDK ...)
	@docker run --rm -v $(PWD):/api $(IMAGE):$(TAG) --name sdk-js-build npm run build-api-models

test: build-docker-img npm-install ## Run tests
	$(info NPM - Running Tests ...)
	@docker run --rm -v $(PWD):/api --name sdk-js-tests $(IMAGE):$(TAG) npm run test
