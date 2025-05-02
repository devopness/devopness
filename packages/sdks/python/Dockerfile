ARG PYTHON_VERSION="3.13"
ARG ALPINE_VERSION="3.21"
FROM python:${PYTHON_VERSION}-alpine${ALPINE_VERSION}

# --- System dependencies installation ---
RUN apk update && apk add --no-cache bash openjdk11-jre

# Grant full permissions to /usr/local - required for poetry usage
RUN chmod -R 777 /usr/local

WORKDIR /sdk

# --- Package dependencies installation ---
RUN pip install poetry

ENV POETRY_VIRTUALENVS_CREATE=false

COPY poetry.lock pyproject.toml ./
RUN poetry install --no-root
