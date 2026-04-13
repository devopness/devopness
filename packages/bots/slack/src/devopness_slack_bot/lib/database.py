"""
Database initialization and connection management for Tortoise ORM.
"""

from pathlib import Path

from tortoise import Tortoise


async def init_database() -> None:
    """
    Initialize the database connection and create tables if they don't exist.
    Uses SQLite by default, stored in the project's data directory.
    """
    # Store database in packages/bots/slack/data/
    db_path = Path(__file__).parent.parent.parent.parent / "data" / "bot.db"
    db_path.parent.mkdir(parents=True, exist_ok=True)

    await Tortoise.init(
        db_url=f"sqlite://{db_path}",
        modules={"models": ["devopness_slack_bot.models"]},
    )

    # Create tables if they don't exist
    await Tortoise.generate_schemas()


async def close_database() -> None:
    """
    Close all database connections.
    """
    await Tortoise.close_connections()
