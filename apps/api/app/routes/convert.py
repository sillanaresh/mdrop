from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.models.schemas import ConvertResult, FormatsResponse, HealthResponse
from app.services.converter import convert_file, convert_url

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

SUPPORTED_FORMATS = [
    {"id": "pdf", "label": "PDF", "extensions": [".pdf"], "description": "Text, headings, and tables"},
    {"id": "docx", "label": "Word", "extensions": [".docx"], "description": "Headings, lists, and formatting"},
    {"id": "pptx", "label": "PowerPoint", "extensions": [".pptx"], "description": "Slides and speaker notes"},
    {"id": "xlsx", "label": "Excel", "extensions": [".xlsx"], "description": "Spreadsheets and tables"},
    {"id": "csv", "label": "CSV", "extensions": [".csv"], "description": "Structured data as tables"},
    {"id": "image", "label": "Image", "extensions": [".png", ".jpg", ".jpeg", ".webp"], "description": "Metadata and image info"},
    {"id": "url", "label": "Web / YouTube", "extensions": [], "description": "Web pages and YouTube transcripts"},
]


@router.post("/convert", response_model=ConvertResult)
async def convert(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
):
    if not file and not url:
        raise HTTPException(
            status_code=422,
            detail={"error": "missing_input", "message": "Provide either a file or a URL."},
        )

    if file and url:
        raise HTTPException(
            status_code=422,
            detail={"error": "ambiguous_input", "message": "Provide either a file or a URL, not both."},
        )

    if file:
        content = await file.read()

        if len(content) == 0:
            raise HTTPException(
                status_code=422,
                detail={"error": "empty_file", "message": "The file appears to be empty."},
            )

        if len(content) > MAX_FILE_SIZE:
            mb = len(content) // 1024 // 1024
            raise HTTPException(
                status_code=413,
                detail={
                    "error": "file_too_large",
                    "message": f"File is {mb} MB. Maximum size is 10 MB.",
                    "max_bytes": MAX_FILE_SIZE,
                },
            )

        return await convert_file(content, file.filename or "upload")

    # url path
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=422,
            detail={"error": "invalid_url", "message": "URL must start with http:// or https://"},
        )

    return await convert_url(url)


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", version="1.0.0")


@router.get("/formats", response_model=FormatsResponse)
async def formats():
    return FormatsResponse(formats=SUPPORTED_FORMATS)
