import os
import uuid

from app.storage.storage_interface import StorageInterface

# Base directory where resumes are stored locally during development
UPLOAD_DIR = os.path.join(
    os.path.dirname(__file__), "uploads", "resumes"
)


class LocalStorageService(StorageInterface):
    def __init__(self):
        os.makedirs(UPLOAD_DIR, exist_ok=True)

    def upload(self, file_bytes: bytes, filename: str) -> str:
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        # Return a reference relative to the storage root, consistent
        # in shape with what BlobStorageService will return.
        return f"local://resumes/{unique_name}"

    def download(self, file_reference: str) -> bytes:
        unique_name = file_reference.replace("local://resumes/", "")
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_reference}")

        with open(file_path, "rb") as f:
            return f.read()

    def delete(self, file_reference: str) -> None:
        unique_name = file_reference.replace("local://resumes/", "")
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        if os.path.exists(file_path):
            os.remove(file_path)