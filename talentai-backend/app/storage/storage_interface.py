from abc import ABC, abstractmethod


class StorageInterface(ABC):
    """
    Common contract for file storage backends. Both LocalStorageService
    (development) and BlobStorageService (Azure, production) implement
    this interface, so the rest of the app can use either one
    interchangeably without knowing which is active.
    """

    @abstractmethod
    def upload(self, file_bytes: bytes, filename: str) -> str:
        """
        Saves a file and returns a reference URL/path that can later
        be used to retrieve or delete it.
        """
        raise NotImplementedError

    @abstractmethod
    def download(self, file_reference: str) -> bytes:
        """
        Retrieves the raw bytes of a previously uploaded file, given
        the reference returned by upload().
        """
        raise NotImplementedError

    @abstractmethod
    def delete(self, file_reference: str) -> None:
        """
        Deletes a previously uploaded file, given its reference.
        """
        raise NotImplementedError