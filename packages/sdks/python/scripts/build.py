#!/usr/bin/env python3

# pylint: disable=missing-function-docstring
# pylint: disable=missing-module-docstring

import json
import os
import shutil
import subprocess
import sys

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


def run_openapi_generator(extra_args: list[str] | None = None) -> None:
    print("🚀  Running OpenAPI Generator...")

    cmd_parts = [
        "bash -c '",
        "openapi-generator-cli generate",
        '--input-spec="../common/spec.json"',
        '--generator-name="python"',
        '--output="./devopness/_generated"',
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


def run_openapi_generator_with_temporary_cleanup() -> None:
    """
    TEMPORARY HACK FOR INITIAL SDK DEVELOPMENT

    We're removing all generated files that are not in test-scope
    to keep the number of auto-generated files as low as possible
    during the initial development of SDK.

    This helps validate the core structure and functionality
    of the SDK before exposing all endpoints.
    """

    apis_to_generate = [
        "Credentials",
        "CredentialsRepositories",
        "Environments",
        "Projects",
        "ProjectsArchivedEnvironments",
        "ProjectsEnvironments",
        "Servers",
        "Users",
    ]

    apis_string = ":".join(apis_to_generate)
    apis_property = f"--global-property apis={apis_string},supportingFiles=__init__.py"

    openapi_generator_extra_args: list[str] = []
    openapi_generator_extra_args.append(apis_property)
    openapi_generator_extra_args.append("--global-property models")

    # The OpenAPI Generator does not support filtering tags with spaces.
    # Therefore, we need to create a modified version of the spec.json
    # that removes the spaces before passing it to the generator.
    input_path = os.path.join(SDK_ROOT_DIR, "..", "common", "spec.json")
    output_path = "/usr/local/share/spec.json"
    with open(input_path, "r") as input_file:
        content = json.load(input_file)
        for _endpoint, endpoint_info in content["paths"].items():
            for _method, method_info in endpoint_info.items():
                if "tags" in method_info:
                    method_info["tags"] = [
                        tag.replace(" ", "").replace("-", "")
                        for tag in method_info["tags"]
                    ]

        with open(output_path, "w") as output_file:
            output_file.write(json.dumps(content))

    openapi_generator_extra_args.append(f"--input-spec={output_path}")

    run_openapi_generator(openapi_generator_extra_args)


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
        # TODO: Use _core.<model_name> to avoid the need to export the model in
        #       _core.__init__.py
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

    # Dictionary mapping auto-generated PascalCase service names to their
    # desired final names.
    #
    # This is used to handle cases where the standard conversion doesn't
    # produce the exact required casing, especially for acronyms (like SSH).
    #
    # Keys are the names produced by the automatic conversion (PascalCase).
    # Values are the desired, manually specified names.
    service_name_overrides = {
        "SshKeyService": "SSHKeyService",
        "SslCertificateService": "SSLCertificateService",
    }

    # Build the import statements
    for item in files:
        service = item.replace(".py", "")
        service_name = snake_to_pascal(service)

        if service_name in service_name_overrides:
            service_name = service_name_overrides[service_name]

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


def format_generated_files() -> None:
    print("🔧  Formatting generated files...")

    cmd = "bash -c 'ruff format .'"
    subprocess.run(cmd, shell=True, check=False)


def fix_code_style_issues() -> None:
    print("🔧  Fixing code style issues in generated files...")

    cmd = "bash -c 'ruff check --fix -s'"
    subprocess.run(cmd, shell=True, check=False)


def fix_import_issues() -> None:
    print("🔧  Fixing import issues in generated files...")

    cmd = "bash -c 'ruff check --select I --fix'"
    subprocess.run(cmd, shell=True, check=False)


def remove_openapi_generator_cache() -> None:
    print("🧹  Removing OpenAPI Generator Cache...")

    dir_path = os.path.join(GENERATED_DIR, ".openapi-generator")
    shutil.rmtree(dir_path, ignore_errors=True)


if __name__ == "__main__":
    try:
        remove_previous_generated_directories()
        # run_openapi_generator()
        run_openapi_generator_with_temporary_cleanup()

        export_sdk_core()
        export_sdk_models()
        export_sdk_services()

        print("🔧  Executing post-build tasks...")
        remove_openapi_generator_cache()
        fix_import_issues()
        fix_code_style_issues()
        format_generated_files()

        print("✅  Devopness SDK - Python Build completed successfully!")

    except subprocess.CalledProcessError as e:
        print(f"Error during execution: {e}")
        sys.exit(1)
