ARG PYTHON_VERSION="3.12"
ARG ALPINE_VERSION="3.21"
FROM python:${PYTHON_VERSION}-alpine${ALPINE_VERSION}

# --- System dependencies installation ---
RUN apk update && apk add --no-cache bash openjdk11-jre

WORKDIR /mcp

# --- Package dependencies installation ---
RUN pip install uv==0.7.11

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="${VIRTUAL_ENV}/bin:${PATH}"
ENV UV_LINK_MODE=copy

COPY uv.lock pyproject.toml ./
RUN uv venv $VIRTUAL_ENV --allow-existing -q
RUN uv sync --active --all-groups --compile-bytecode
