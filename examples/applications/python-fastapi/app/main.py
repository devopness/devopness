from fastapi import FastAPI

app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello from Python and FastAPI!"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
