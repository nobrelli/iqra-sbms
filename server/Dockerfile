# Get all dependencies
FROM python:3.12.7-alpine3.20 AS builder

RUN apk update && apk upgrade && apk --no-cache add curl poetry=1.8.3-r0

COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt -o requirements.txt --without-hashes

# Final
FROM builder AS serve

WORKDIR /home/iqra-sbms-api

COPY --from=builder requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -U -r requirements.txt

COPY . .

EXPOSE 5000

CMD gunicorn
