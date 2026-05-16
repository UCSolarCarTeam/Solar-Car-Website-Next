FROM --platform=linux/amd64 public.ecr.aws/lambda/python:3.12

WORKDIR /var/task

# Copy requirements first
COPY scripts/requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy only required files
COPY lambda_function.py .
COPY scripts ./scripts

# Optional runtime data files
COPY members.json .

# Lambda entrypoint
CMD ["lambda_function.handler"]