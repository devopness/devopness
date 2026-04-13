import argparse
import os
from types import UnionType
from typing import (
    Annotated,
    Any,
    Literal,
    Union,
    get_args,
    get_origin,
    get_type_hints,
    override,
)

import dotenv


class EnvironmentVariables:
    DEVOPNESS_API_URL: str | None = "https://api.devopness.com"

    DEVOPNESS_SLACK_BOT_TOKEN: str
    DEVOPNESS_SLACK_APP_TOKEN: str
    DEVOPNESS_ENCRYPTION_KEY: str

    # repr from @dataclass with multiline output
    @override
    def __repr__(self) -> str:
        fields = self.__annotations__.keys()
        lines = [f"    {field}={getattr(self, field)!r}," for field in fields]
        return f"{self.__class__.__qualname__}(\n" + "\n".join(lines) + "\n)"


def unwrap_type(annotation: type) -> Any:  # noqa: ANN401
    """
    Unwraps Annotated and Optional types to extract:
    - The actual base type (e.g., str, int, Literal[...])
    - CLI argument name (from Annotated)
    - Whether the field is Optional
    """
    cli_name = None

    if get_origin(annotation) is Annotated:
        inner, *meta = get_args(annotation)
        annotation = inner
        cli_name = meta[0] if meta else None

    # Handle both typing.Union and types.UnionType (X | Y syntax in Python 3.10+)
    origin = get_origin(annotation)
    if origin is Union or origin is UnionType:
        args = get_args(annotation)
        non_none = [a for a in args if a is not type(None)]
        if len(non_none) == 1:
            return non_none[0], cli_name, True  # actual_type, cli_name, is_optional

    return annotation, cli_name, False


def cast_value(value: str, expected_type: type) -> str | int:
    origin = get_origin(expected_type)

    if origin is Literal:
        allowed_values = get_args(expected_type)
        if value not in allowed_values:
            raise ValueError(f"Expected one of {allowed_values}, got '{value}'")
        return value

    if expected_type is str:
        return value

    if expected_type is int:
        return int(value)

    if expected_type is bool:
        return bool(value)

    raise ValueError(f"Unsupported cast type: {expected_type}")


def load_environment_variables(
    command_line_params: argparse.Namespace,
) -> EnvironmentVariables:
    dotenv.load_dotenv(override=True)

    environment = EnvironmentVariables()
    hints = get_type_hints(EnvironmentVariables, include_extras=True)
    missing_variables = []

    for field_name, annotation in hints.items():
        origin = get_origin(annotation)
        args = get_args(annotation)

        cli_name = None
        if origin is Annotated:
            annotated_type, *metadata = args
            annotation = annotated_type  # noqa: PLW2901
            if metadata:
                cli_name = metadata[0]

        # Handle both typing.Union and types.UnionType (X | Y syntax in Python 3.10+)
        annotation_origin = get_origin(annotation)
        is_optional = (
            annotation_origin is Union or annotation_origin is UnionType
        ) and type(None) in get_args(annotation)
        if is_optional:
            non_none_types = [
                arg for arg in get_args(annotation) if arg is not type(None)
            ]
            if len(non_none_types) != 1:
                raise TypeError(f"Invalid optional type annotation for {field_name}")
            expected_type = non_none_types[0]
        else:
            expected_type = annotation

        # Order of precedence: CLI > ENV > Default
        raw_value = None

        if cli_name and getattr(command_line_params, cli_name, None) is not None:
            raw_value = getattr(command_line_params, cli_name)
        elif os.environ.get(field_name) is not None:
            raw_value = os.environ[field_name]
        elif hasattr(EnvironmentVariables, field_name):
            raw_value = getattr(EnvironmentVariables, field_name)

        if raw_value is None:
            if not is_optional:
                missing_variables.append(field_name)
            setattr(environment, field_name, None)
            continue

        try:
            casted = cast_value(raw_value, expected_type)
            setattr(environment, field_name, casted)
        except ValueError as e:
            raise RuntimeError(f"Invalid value for {field_name}: {e}") from None

    if missing_variables:
        variables = "\t- " + "\n\t- ".join(missing_variables)
        message = f"""
          ❌ The following environment variables are required but not set:
        {variables}
        """
        raise RuntimeError(message)

    # Save the environment variables to the environment
    for key, value in environment.__dict__.items():
        os.environ[key] = str(value)

    return environment
