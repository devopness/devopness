#!/usr/bin/env python3

# pylint: disable=missing-function-docstring
# pylint: disable=missing-module-docstring

import os
import shutil
import subprocess
import sys
from glob import glob

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


def run_openapi_generator(extra_args: list[str] | None = None) -> None:
    print("🚀  Running OpenAPI Generator...")

    cmd_parts = [
        "bash -c '",
        "openapi-generator-cli generate",
        '--input-spec="../common/spec.json"',
        '--generator-name="python"',
        '--output="./src/devopness/generated"',
        '--template-dir="./generator/templates"',
        '--additional-properties="packageName="',
    ]

    if extra_args is not None:
        cmd_parts.extend(extra_args)

    # Add the closing quote to the command
    cmd_parts.append("'")

    cmd = " ".join(cmd_parts)
    subprocess.run(
        cmd,
        shell=True,
        check=True,
        env={"JAVA_OPTS": "-Dlog.level=warn"},
    )


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
    for name in names:
        lines.append(f'    "{name}",')

    lines.append("]\n")

    # Write final the file content
    with open(SDK_MODELS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def format_generated_files() -> None:
    print("🔧  Formatting generated files...")

    cmd = f"bash -c 'ruff format -s {GENERATED_DIR} {SDK_MODELS_FILE}'"
    subprocess.run(cmd, shell=True, check=False)


def fix_code_style_issues() -> None:
    print("🔧  Fixing code style issues in generated files...")

    cmd = f"bash -c 'ruff check --fix -s {GENERATED_DIR} {SDK_MODELS_FILE}'"
    subprocess.run(cmd, shell=True, check=False)


def fix_import_issues() -> None:
    print("🔧  Fixing import issues in generated files...")

    cmd = f"bash -c 'ruff check --select I --fix -s {GENERATED_DIR} {SDK_MODELS_FILE}'"
    subprocess.run(cmd, shell=True, check=False)


def remove_openapi_generator_cache() -> None:
    print("🧹  Removing OpenAPI Generator Cache...")

    dir_path = os.path.join(GENERATED_DIR, ".openapi-generator")
    shutil.rmtree(dir_path, ignore_errors=True)


if __name__ == "__main__":
    try:
        remove_previous_generated_files()
        run_openapi_generator()

        print("🔧  Executing post-build tasks...")
        remove_openapi_generator_cache()
        export_sdk_models()
        fix_import_issues()
        fix_code_style_issues()
        format_generated_files()

        print("✅  Devopness SDK - Python Build completed successfully!")

    except subprocess.CalledProcessError as e:
        print(f"Error during execution: {e}")
        sys.exit(1)
