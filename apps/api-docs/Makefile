IMAGE=devopness-api-docs
TAG ?= latest

.PHONY: all build

all: build dev

build: ## Build image to be used
	@docker build -f Dockerfile -t $(IMAGE) .

dev: ## Start development environment
	$(info Starting development environment...)
	@docker compose up -d
  $(info Documentation available at http://localhost:9090/)

npm: ## Run npm with the provided ARGS. e.g.: `make npm ARGS=test`
	$(info npm - Running npm $(ARGS)...)
	@docker run --rm \
	-v $(PWD):/api-docs \
	--name api-docs-npm \
	-it $(IMAGE):$(TAG) \
	npm $(ARGS)

shell: ## Run a container for ad-hoc tasks and debugging
	@docker run --rm \
	-v $(PWD):/api-docs \
	--name api-docs-shell \
	-it $(IMAGE):$(TAG) \
	/bin/bash

help: ## Show this help.
# `help' function obtained from GitHub gist: https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123#gistcomment-4160123
	@echo Devopness API Docs
	@echo
	@awk 'BEGIN {FS = ": .*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+(\\:[$$()% 0-9a-zA-Z_-]+)*:.*?##/ { gsub(/\\:/,":", $$1); printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.DEFAULT_GOAL=help
