test:
	@docker build --force-rm -f Dockerfile-dev -t devopness_sdk-javascript .
	@docker run devopness_sdk-javascript npm run test

build:
	@docker build --force-rm -f Dockerfile-dev -t devopness_sdk-javascript .
	@docker run -v sdk-javascript:/usr/app/ devopness_sdk-javascript npm run build-api-models
