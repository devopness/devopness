#!/usr/bin/env python3

# pylint: disable=missing-function-docstring
# pylint: disable=missing-module-docstring

import os
import shutil
from glob import glob

import openapi_generator_cli

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

SDK_ROOT_DIR = os.path.join(SCRIPT_DIR, "..")
GENERATED_DIR = os.path.join(SDK_ROOT_DIR, "src", "devopness", "generated")

SDK_MODELS_DIR = os.path.join(GENERATED_DIR, "models")
SDK_MODELS_FILE = os.path.join(SDK_ROOT_DIR, "src", "devopness", "models.py")

GENERATED_API_DIR = os.path.join(GENERATED_DIR, "api")
GENERATED_MODELS_DIR = os.path.join(GENERATED_DIR, "models")


def snake_to_pascal(name: str) -> str:
    return "".join(word.title() for word in name.split("_"))


def remove_previous_generated_files() -> None:
    print("🧹  Removing previous generated .py files...")

    if os.path.isdir(GENERATED_API_DIR):
        for file in glob(os.path.join(GENERATED_API_DIR, "*.py")):
            os.remove(file)

    if os.path.isdir(GENERATED_MODELS_DIR):
        for file in glob(os.path.join(GENERATED_MODELS_DIR, "*.py")):
            os.remove(file)


def run_openapi_generator() -> None:
    print("🚀  Running OpenAPI Generator...")

    args = [
        "generate",
        "--input-spec",
        "../common/spec.json",
        "--generator-name",
        "python",
        "--output",
        "./src/devopness/generated",
        "--template-dir",
        "./generator/templates",
        "--additional-properties",
        "packageName",
    ]

    os.environ["JAVA_OPTS"] = "-Dlog.level=warn"
    openapi_generator_cli.run(args)


def export_sdk_models() -> None:
    print("🚀  Exporting SDK models...")

    if os.path.exists(SDK_MODELS_FILE):
        os.remove(SDK_MODELS_FILE)

    files = [
        f
        for f in os.listdir(SDK_MODELS_DIR)
        if os.path.isfile(os.path.join(SDK_MODELS_DIR, f))
        and f.endswith(".py")
        and not f.startswith("__")
    ]

    names: list[str] = []
    lines: list[str] = [
        '"""',
        "Devopness API Python SDK - Painless essential DevOps to everyone",
        '"""',
    ]

    # Build the import statements
    for item in files:
        model = item.replace(".py", "")
        model_name = snake_to_pascal(model)

        names.append(model_name)
        names.append(model_name + "Plain")

        lines.append(f"from .generated.models import {model_name}, {model_name}Plain")

    # Build the __all__ list
    lines.append("\n")
    lines.append("__all__ = [")

    names.sort()
    lines.extend(f'    "{name}",' for name in names)

    lines.append("]\n")

    # Write final the file content
    with open(SDK_MODELS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def remove_openapi_generator_cache() -> None:
    print("🧹  Removing OpenAPI Generator Cache...")

    dir_path = os.path.join(GENERATED_DIR, ".openapi-generator")
    shutil.rmtree(dir_path, ignore_errors=True)


if __name__ == "__main__":
    remove_previous_generated_files()
    run_openapi_generator()
    export_sdk_models()
    remove_openapi_generator_cache()
