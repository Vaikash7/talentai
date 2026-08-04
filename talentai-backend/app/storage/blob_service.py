import os
import uuid

from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

from app.storage.storage_interface import StorageInterface

load_dotenv()

AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_STORAGE_CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME", "resumes")


class BlobStorageService(StorageInterface):
    def __init__(self):
        if not AZURE_STORAGE_CONNECTION_STRING:
            raise ValueError(
                "AZURE_STORAGE_CONNECTION_STRING is not set. "
                "Check your .env file (see .env.example)."
            )
        self.client = BlobServiceClient.from_connection_string(
            AZURE_STORAGE_CONNECTION_STRING
        )
        self.container_client = self.client.get_container_client(
            AZURE_STORAGE_CONTAINER_NAME
        )

    def upload(self, file_bytes: bytes, filename: str) -> str:
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        blob_client = self.container_client.get_blob_client(unique_name)
        blob_client.upload_blob(file_bytes, overwrite=True)
        return blob_client.url

    def download(self, file_reference: str) -> bytes:
        blob_name = file_reference.rsplit("/", 1)[-1]
        blob_client = self.container_client.get_blob_client(blob_name)
        return blob_client.download_blob().readall()

    def delete(self, file_reference: str) -> None:
        blob_name = file_reference.rsplit("/", 1)[-1]
        blob_client = self.container_client.get_blob_client(blob_name)
        blob_client.delete_blob()