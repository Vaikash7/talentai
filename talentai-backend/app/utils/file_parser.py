import io

import pdfplumber
from docx import Document


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """
    Extracts plain text from an uploaded resume file.
    Supports .pdf and .docx. Raises ValueError for unsupported types.
    """
    extension = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""

    if extension == "pdf":
        return _extract_from_pdf(file_bytes)
    elif extension == "docx":
        return _extract_from_docx(file_bytes)
    else:
        raise ValueError(
            f"Unsupported file type: '.{extension}'. "
            "Only .pdf and .docx resumes are supported."
        )


def _extract_from_pdf(file_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts).strip()


def _extract_from_docx(file_bytes: bytes) -> str:
    document = Document(io.BytesIO(file_bytes))
    text_parts = [paragraph.text for paragraph in document.paragraphs if paragraph.text]
    return "\n".join(text_parts).strip()