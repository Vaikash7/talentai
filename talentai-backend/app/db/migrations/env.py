import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Ensure the app package is importable regardless of where alembic is run from
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

load_dotenv()

from app.db.base import Base
from app.db.models import *  # noqa: F401, F403 — imports every model so Alembic can see all tables

# Alembic Config object, provides access to values in alembic.ini
config = context.config

# Override the sqlalchemy.url from alembic.ini with our real .env value.
# %% escaping is required because configparser treats % as a special
# interpolation character — our URL-encoded password (e.g. %40 for @)
# would otherwise be misread as broken interpolation syntax.
db_url = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", db_url.replace("%", "%%"))

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# This is what Alembic compares against the live database to detect changes
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generates SQL without a live DB connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (connects directly to the database)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()