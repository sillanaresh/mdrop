import os
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.convert import router as convert_router

log = structlog.get_logger()

DEFAULT_ALLOWED_ORIGINS = (
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://mdrop-conv.vercel.app",
    "https://mdrop.vercel.app",
)


def _allowed_origins() -> list[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if raw.strip() == "*":
        return ["*"]

    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    for origin in DEFAULT_ALLOWED_ORIGINS:
        if origin not in origins:
            origins.append(origin)

    return origins


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("mdrop_api_start", version="1.0.0")
    yield
    log.info("mdrop_api_stop")


app = FastAPI(
    title="MDrop API",
    description="Convert files and URLs to Markdown",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(convert_router)
