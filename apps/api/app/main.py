import os
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.convert import router as convert_router

log = structlog.get_logger()


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

# Build CORS origin list — add your Vercel URL via ALLOWED_ORIGINS env var
allowed_origins = ["http://localhost:3000", "http://localhost:3001"]
extra = os.getenv("ALLOWED_ORIGINS", "")
if extra:
    allowed_origins.extend(o.strip() for o in extra.split(",") if o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(convert_router)
