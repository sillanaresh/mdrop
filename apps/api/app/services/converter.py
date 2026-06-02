import asyncio
import io
import ipaddress
import socket
import time
from pathlib import Path
from urllib.parse import urlparse

import structlog
from fastapi import HTTPException
from markitdown import MarkItDown, StreamInfo
from markitdown._exceptions import (
    FileConversionException,
    MissingDependencyException,
    UnsupportedFormatException,
)

from app.models.schemas import ConvertResult

log = structlog.get_logger()

# Singleton — avoid re-initializing on every request
_md = MarkItDown()

_EXTENSION_TO_FORMAT = {
    ".pdf": "pdf",
    ".docx": "docx",
    ".pptx": "pptx",
    ".xlsx": "xlsx",
    ".csv": "csv",
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".webp": "image",
}


def _detect_format(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    return _EXTENSION_TO_FORMAT.get(ext, "unknown")


def _convert_bytes_sync(content: bytes, filename: str):
    """Blocking MarkItDown call — runs in a thread pool via asyncio.to_thread."""
    ext = Path(filename).suffix.lower() if filename else ""
    stream = io.BytesIO(content)
    stream_info = StreamInfo(filename=filename, extension=ext or None)
    return _md.convert_stream(stream, stream_info=stream_info)


async def convert_file(content: bytes, filename: str) -> ConvertResult:
    start = time.time()
    log.info("convert_file_start", filename=filename, size_bytes=len(content))

    try:
        result = await asyncio.to_thread(_convert_bytes_sync, content, filename)
    except UnsupportedFormatException as e:
        log.warning("unsupported_format", filename=filename, error=str(e))
        raise HTTPException(
            status_code=400,
            detail={
                "error": "unsupported_format",
                "message": "This file type isn't supported. Try PDF, Word, PowerPoint, Excel, an image, or a URL.",
            },
        )
    except FileConversionException as e:
        log.warning("conversion_failed", filename=filename, error=str(e))
        raise HTTPException(
            status_code=422,
            detail={
                "error": "conversion_failed",
                "message": "Couldn't convert this file. It may be corrupted, password-protected, or an unsupported variant.",
            },
        )
    except MissingDependencyException as e:
        log.error("missing_dependency", error=str(e))
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "An internal error occurred. Please try again.",
            },
        )
    except Exception as e:
        log.error("unexpected_error", filename=filename, error=str(e))
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "An unexpected error occurred.",
            },
        )

    elapsed_ms = int((time.time() - start) * 1000)
    markdown = result.markdown or ""
    log.info(
        "convert_file_done",
        filename=filename,
        elapsed_ms=elapsed_ms,
        chars=len(markdown),
    )

    return ConvertResult(
        markdown=markdown,
        title=result.title,
        filename=filename,
        format=_detect_format(filename),
        char_count=len(markdown),
        word_count=len(markdown.split()) if markdown else 0,
        processing_time_ms=elapsed_ms,
    )


def _convert_uri_sync(url: str):
    return _md.convert_uri(url)


def _is_private_address(hostname: str) -> bool:
    try:
        ip = ipaddress.ip_address(hostname)
        return (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        )
    except ValueError:
        pass

    if hostname.lower() == "localhost":
        return True

    try:
        addresses = socket.getaddrinfo(hostname, None)
    except socket.gaierror:
        return False

    for address in addresses:
        resolved = ipaddress.ip_address(address[4][0])
        if (
            resolved.is_private
            or resolved.is_loopback
            or resolved.is_link_local
            or resolved.is_multicast
            or resolved.is_reserved
            or resolved.is_unspecified
        ):
            return True
    return False


def _validate_public_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "invalid_url",
                "message": "URL must start with http:// or https:// and include a public host.",
            },
        )

    if _is_private_address(parsed.hostname):
        raise HTTPException(
            status_code=422,
            detail={
                "error": "invalid_url",
                "message": "Private, localhost, and internal network URLs cannot be converted.",
            },
        )


async def convert_url(url: str) -> ConvertResult:
    start = time.time()
    log.info("convert_url_start", url=url)
    _validate_public_url(url)

    try:
        result = await asyncio.to_thread(_convert_uri_sync, url)
    except UnsupportedFormatException:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "unsupported_format",
                "message": "This URL type isn't supported. Try a web page, YouTube video, or Wikipedia article.",
            },
        )
    except Exception as e:
        log.error("url_conversion_failed", url=url, error=str(e))
        raise HTTPException(
            status_code=422,
            detail={
                "error": "conversion_failed",
                "message": "Couldn't fetch or convert this URL. Check that it's publicly accessible.",
            },
        )

    elapsed_ms = int((time.time() - start) * 1000)
    markdown = result.markdown or ""

    parsed = urlparse(url)
    display_name = parsed.netloc + (parsed.path.rstrip("/") or "")

    log.info("convert_url_done", url=url, elapsed_ms=elapsed_ms)

    return ConvertResult(
        markdown=markdown,
        title=result.title,
        filename=display_name or url,
        format="url",
        char_count=len(markdown),
        word_count=len(markdown.split()) if markdown else 0,
        processing_time_ms=elapsed_ms,
    )
