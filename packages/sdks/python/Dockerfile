ARG PYTHON_VERSION="3.13"
ARG ALPINE_VERSION="3.21"
FROM python:${PYTHON_VERSION}-alpine${ALPINE_VERSION}

# --- System dependencies installation ---
RUN apk update && apk add --no-cache bash openjdk11-jre

# --- User configuration ---
ARG USER_ID
ARG USER_NAME
ARG GROUP_ID
ARG GROUP_NAME

# Create user and group with specified IDs
RUN addgroup -g "${GROUP_ID}" -S "${GROUP_NAME}" \
  && adduser -u "${USER_ID}" -S "${USER_NAME}" -G "${GROUP_NAME}"

# Grant full permissions to /usr/local - required for poetry usage
RUN chmod -R 777 /usr/local

USER ${USER_NAME}
WORKDIR /sdk

# --- Package dependencies installation ---
RUN pip install poetry

COPY poetry.lock pyproject.toml ./
RUN POETRY_VIRTUALENVS_CREATE=false poetry install --no-root
