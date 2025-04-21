#!/usr/bin/env python3

# pylint: disable=missing-function-docstring
# pylint: disable=missing-module-docstring

import os
import shutil
import subprocess
import sys
from typing import Literal

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

SDK_ROOT_DIR = os.path.join(SCRIPT_DIR, "..")
GENERATED_DIR = os.path.join(SDK_ROOT_DIR, "devopness", "_generated")

SDK_CORE_DIR = os.path.join(SDK_ROOT_DIR, "devopness", "_core")
SDK_CORE_FILE = os.path.join(SDK_ROOT_DIR, "devopness", "core.py")

SDK_MODELS_DIR = os.path.join(GENERATED_DIR, "models")
SDK_MODELS_FILE = os.path.join(SDK_ROOT_DIR, "devopness", "models.py")

SDK_SERVICES_DIR = os.path.join(SDK_ROOT_DIR, "devopness", "_services")
SDK_SERVICES_FILE = os.path.join(SDK_ROOT_DIR, "devopness", "services.py")

GENERATED_API_DIR = os.path.join(GENERATED_DIR, "api")
GENERATED_MODELS_DIR = os.path.join(GENERATED_DIR, "models")


def snake_to_pascal(name: str) -> str:
    return "".join(word.title() for word in name.split("_"))


def remove_previous_generated_directories() -> None:
    print("🧹  Removing previous generated directories...")

    if os.path.isdir(GENERATED_API_DIR):
        shutil.rmtree(GENERATED_API_DIR)

    if os.path.isdir(GENERATED_MODELS_DIR):
        shutil.rmtree(GENERATED_MODELS_DIR)


def run_openapi_generator() -> None:
    print("🚀  Running OpenAPI Generator...")

    cmd = "bash -c 'openapi-generator-cli generate'"
    subprocess.run(
        cmd,
        shell=True,
        check=True,
        env={"JAVA_OPTS": "-Dlog.level=warn"},
    )


def export_sdk_core() -> None:
    print("🚀  Exporting SDK core...")

    if os.path.exists(SDK_CORE_FILE):
        os.remove(SDK_CORE_FILE)

    files = [
        f
        for f in os.listdir(SDK_CORE_DIR)
        if os.path.isfile(os.path.join(SDK_CORE_DIR, f))
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
        model_name = "Devopness" + snake_to_pascal(model)

        names.append(model_name)
        lines.append(f"from ._core import {model_name}")

    # Build the __all__ list
    lines.append("\n")
    lines.append("__all__ = [")

    names.sort()
    for name in names:
        lines.append(f'    "{name}",')

    lines.append("]")

    # Write final the file content
    with open(SDK_CORE_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


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
        lines.append(f"from ._generated.models import {model_name}")

    # Build the __all__ list
    lines.append("\n")
    lines.append("__all__ = [")

    names.sort()
    for name in names:
        lines.append(f'    "{name}",')

    lines.append("]")

    # Write final the file content
    with open(SDK_MODELS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def export_sdk_services() -> None:
    print("🚀  Exporting SDK services...")

    if os.path.exists(SDK_SERVICES_FILE):
        os.remove(SDK_SERVICES_FILE)

    files = [
        f
        for f in os.listdir(SDK_SERVICES_DIR)
        if os.path.isfile(os.path.join(SDK_SERVICES_DIR, f))
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
        service = item.replace(".py", "")
        service_name = snake_to_pascal(service)

        names.append(service_name)
        lines.append(f"from ._services.{service} import {service_name}")

    # Build the __all__ list
    lines.append("\n")
    lines.append("__all__ = [")

    names.sort()
    for name in names:
        lines.append(f'    "{name}",')

    lines.append("]")

    # Write the final file content
    with open(SDK_SERVICES_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def fix_permissions_and_ownership(
    dir_path: str | None = None,
    file_path: str | None = None,
) -> None:
    print(f"🔧  Fixing permissions and ownership for {dir_path}...")

    if dir_path and os.path.isdir(dir_path):
        # Change directory permissions
        subprocess.run(
            [
                "find",
                dir_path,
                "-type",
                "d",
                "-exec",
                "chmod",
                "755",
                "{}",
                ";",
            ],
            check=True,
        )

    if file_path:
        # Change file permissions
        subprocess.run(
            [
                "find",
                file_path,
                "-type",
                "f",
                "-exec",
                "chmod",
                "644",
                "{}",
                ";",
            ],
            check=True,
        )

    # If USER_ID and GROUP_ID are set, change ownership
    user_id = os.getenv("USER_ID")
    group_id = os.getenv("GROUP_ID")

    if user_id and group_id:
        if dir_path is None and file_path is None:
            return

        path: str = dir_path if dir_path else file_path  # type: ignore
        subprocess.run(
            [
                "chown",
                "-R",
                f"{user_id}:{group_id}",
                path,
            ],
            check=True,
        )


def adjust_import_paths_in_files(dir_path, target: Literal["api", "model"]):
    print(f"🔧  Adjusting import paths in {target}s...")

    for file in os.listdir(dir_path):
        if not file.endswith(".py"):
            continue

        file_path = os.path.join(dir_path, file)
        file_content = ""

        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        if target == "api":
            file_content = file_content.replace(
                "from .models.",
                "from ..models.",
            )

        if target == "model":
            file_content = file_content.replace(
                "from .models.",
                "from .",
            )

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(file_content)


def format_generated_files() -> None:
    print("🔧  Formatting generated files...")

    cmd = "bash -c 'ruff format .'"
    subprocess.run(cmd, shell=True, check=False)


def fix_code_style_issues() -> None:
    print("🔧  Fixing code style issues in generated files...")

    cmd = "bash -c 'ruff check --fix'"
    subprocess.run(cmd, shell=True, check=False)


def fix_import_issues() -> None:
    print("🔧  Fixing import issues in generated files...")

    cmd = "bash -c 'ruff check --select I --fix'"
    subprocess.run(cmd, shell=True, check=False)


def remove_openapi_generator_cache() -> None:
    print("🧹  Removing OpenAPI Generator Cache...")

    dir_path = os.path.join(GENERATED_DIR, ".openapi-generator")
    shutil.rmtree(dir_path, ignore_errors=True)


def execute_temp_script():
    print("🧹  Executing temporary script...")

    cmd = 'bash -c "bash scripts/temp.sh"'
    subprocess.run(cmd, shell=True, check=True)


def execute_post_build_tasks() -> None:
    print("🔧  Executing post-build tasks...")

    fix_permissions_and_ownership(file_path=SDK_CORE_FILE)
    fix_permissions_and_ownership(file_path=SDK_MODELS_FILE)
    fix_permissions_and_ownership(file_path=SDK_SERVICES_FILE)

    fix_permissions_and_ownership(GENERATED_API_DIR)
    fix_permissions_and_ownership(GENERATED_MODELS_DIR)

    adjust_import_paths_in_files(GENERATED_API_DIR, "api")
    adjust_import_paths_in_files(GENERATED_MODELS_DIR, "model")

    remove_openapi_generator_cache()

    format_generated_files()
    fix_code_style_issues()
    fix_import_issues()


if __name__ == "__main__":
    try:
        remove_previous_generated_directories()
        run_openapi_generator()

        execute_temp_script()

        export_sdk_core()
        export_sdk_models()
        export_sdk_services()

        execute_post_build_tasks()

        print("✅  Devopness SDK - Python Build completed successfully!")

    except subprocess.CalledProcessError as e:
        print(f"Error during execution: {e}")
        sys.exit(1)
