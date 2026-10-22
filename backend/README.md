# DataForge Estates — Python Flask Backend

Lightweight REST API service providing property data, lead qualification scoring, deterministic property matching, and automated n8n webhook notifications.

## Requirements

- Python 3.10+
- Virtual environment or local Python packages

## Setup & Running Locally

1. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   python app.py
   ```
   The API will listen at `http://localhost:5000`.

## Running Automated Tests

Run the test suite with:
```bash
python -m unittest discover -s .
```

## API Endpoints

- `GET /api/health` — Service health check
- `GET /api/properties` — Filter properties by `purpose`, `type`, `area`, `minPrice`, `maxPrice`
- `GET /api/properties/<id>` — Get single property details
- `POST /api/leads` — Submit lead qualification (computes score & tier, emits event to n8n)
- `GET /api/leads/<id>/matches` — Retrieve deterministic property recommendations for a qualified lead
