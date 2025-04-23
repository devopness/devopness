FROM python:3.13-alpine

# --- System dependencies installation ---
RUN apk update && apk add --no-cache \
  bash \
  openjdk11-jre \
  npm

# --- User configuration ---
ARG USER_ID
ARG USER_NAME
ARG GROUP_ID
ARG GROUP_NAME

# Create user and group with specified IDs
RUN addgroup -g "${GROUP_ID}" -S "${GROUP_NAME}" \
  && adduser -u "${USER_ID}" -S "${USER_NAME}" -G "${GROUP_NAME}"

# Grant full permissions to /usr/local - required for npm packages installation
RUN chmod -R 777 /usr/local

USER ${USER_NAME}
WORKDIR /sdk

# --- Install package dependencies ---
RUN npm install -g @openapitools/openapi-generator-cli \
  && openapi-generator-cli version-manager set 7.12.0

RUN pip install poetry

COPY poetry.lock pyproject.toml ./
RUN POETRY_VIRTUALENVS_CREATE=false poetry install --no-root
