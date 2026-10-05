# ---------------------------------------------------------------
# Dockerfile - package the API into a "container"
#
# Analogy: a shipping container. Everything the app needs (Python,
# libraries, code) is packed inside, so it runs the same on any
# laptop, server or cloud.
#
# Build:  docker build -t todo-api .
# Run:    docker run -p 8000:8000 -e API_KEY=your-secret-key todo-api
# ---------------------------------------------------------------
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DATABASE_URL=sqlite:////data/todo.db

WORKDIR /app

# Install dependencies first (cached layer = faster rebuilds)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Security: don't run as the all-powerful "root" user
RUN useradd --create-home --uid 1000 appuser \
    && mkdir -p /data && chown appuser:appuser /data
USER appuser
VOLUME ["/data"]

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
