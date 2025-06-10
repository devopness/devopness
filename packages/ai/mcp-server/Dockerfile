ARG PYTHON_VERSION="3.12"
ARG ALPINE_VERSION="3.21"
FROM python:${PYTHON_VERSION}-alpine${ALPINE_VERSION}

# --- System dependencies installation ---
RUN apk update && apk add --no-cache bash

WORKDIR /mcp

# --- Package dependencies installation ---
RUN pip install uv==0.7.11

ENV UV_LINK_MODE=copy
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="${VIRTUAL_ENV}/bin:${PATH}"

COPY uv.lock pyproject.toml README.md ./
RUN uv venv $VIRTUAL_ENV --allow-existing -q
RUN uv sync --active --all-groups --compile-bytecode
