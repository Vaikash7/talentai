import os
from dotenv import load_dotenv

from app.storage.storage_interface import StorageInterface
from app.storage.local_storage_service import LocalStorageService
from app.storage.blob_service import BlobStorageService

load_dotenv()


def get_storage_service() -> StorageInterface:
    """
    Factory function — returns the storage backend configured in .env.
    This is the single switch point between local dev storage and
    Azure Blob Storage; nothing else in the app should instantiate
    LocalStorageService or BlobStorageService directly.
    """
    backend = os.getenv("STORAGE_BACKEND", "local").lower()

    if backend == "local":
        return LocalStorageService()
    elif backend == "azure":
        return BlobStorageService()
    else:
        raise ValueError(
            f"Invalid STORAGE_BACKEND value: '{backend}'. "
            "Must be either 'local' or 'azure'. Check your .env file."
        )