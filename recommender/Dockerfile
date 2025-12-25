# Recommender Dockerfile - Optimized for size
FROM python:3.11-slim

WORKDIR /app

# Install only essential system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies with CPU-only PyTorch and minimal CUDA
# This reduces image size from 7.8GB to ~2GB
RUN pip install --no-cache-dir \
    fastapi==0.95.2 \
    uvicorn[standard]==0.22.0 \
    scikit-learn>=1.3.0 \
    torch>=2.0.0 --index-url https://download.pytorch.org/whl/cpu \
    requests==2.31.0 \
    python-multipart==0.0.6 \
    numpy>=1.24.0

# Copy source code
COPY . .

# Expose port
EXPOSE 8001

# Start the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
