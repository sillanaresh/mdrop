from pydantic import BaseModel
from typing import Optional, List


class ConvertResult(BaseModel):
    markdown: str
    title: Optional[str] = None
    filename: str
    format: str
    char_count: int
    word_count: int
    processing_time_ms: int


class HealthResponse(BaseModel):
    status: str
    version: str


class FormatInfo(BaseModel):
    id: str
    label: str
    extensions: List[str]
    description: str


class FormatsResponse(BaseModel):
    formats: List[FormatInfo]
