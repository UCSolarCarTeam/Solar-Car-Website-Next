# Solar Car Team Document Ingestion Guide

This document describes how to re-run the ingestion pipeline for the **SOLARIS Chatbot**. Data from the team website and Wikipedia must be fetched, split into chunks, embedded, and stored in Supabase pgvector so the Chatbot can answer questions accurately.

Currently, we ingest 12 distinct URLs:
* The main Calgary Solar Car team pages (home, team, cars, recruitment, etc.)
* Wikipedia pages for general Solar Car knowledge (World Solar Challenge, ASC, etc.)

## Prerequisites
1. Ensure you have Python installed.
2. In the `c:\Projects\ChatBot` directory, ensure the virtual environment `venv` is present.
3. Your `.env.local` must have:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `OPENROUTER_API_KEY` (Not strictly needed for Scraping, but used for generation).
4. For scraping, we use `Firecrawl`. The script `scripts/scrape.py` is pre-configured with the Firecrawl API key.

## 1. Scraping New Data (Every 6 Months)
To pull fresh information down from the websites, navigate to `c:\Projects\ChatBot` and run the scrape script using the virtual environment:
```bash
./venv/Scripts/python.exe scripts/scrape.py
```
This produces the `documents.json` file in the root folder containing the markdown bodies of each scraped URL.

## 2. Ingesting & Embedding into Supabase
After `documents.json` is generated or updated, run the embedding script. It will run locally (free) with the `all-MiniLM-L6-v2` transformer model to create 384-dimensional vectors.
```bash
./venv/Scripts/python.exe scripts/ingest.py
```

### What does the ingest script do?
1. Loads the markdown files.
2. Uses Langchain's `RecursiveCharacterTextSplitter` (chunk size: 512, overlap: 64).
3. Uses `sentence-transformers` locally to compute 384-d embeddings.
4. Pushes the records into the `documents` table in your Supabase project.

> [!TIP]
> **Production deployment reminder:** Set a 6-month calendar reminder to run these two operations. Supabase will not automatically update the `documents` table unless you set up an automated GitHub Action or Vercel cron job to execute these Python scripts.
