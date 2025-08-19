FROM python:3.13-alpine AS builder

WORKDIR /app

RUN apk add --no-cache gcc musl-dev libffi-dev

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.13-alpine AS runner

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY ./app ./app

RUN adduser --disabled-password --gecos '' appuser

EXPOSE 8000
ENV PATH=/root/.local/bin:$PATH

USER appuser

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]