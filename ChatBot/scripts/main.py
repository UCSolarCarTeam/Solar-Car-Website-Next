from scripts.scrape import scrape
from scripts.clean import clean
from scripts.ingest import ingest

def main():
    # 1. Scrape data from websites
    print("\n--- Starting Scraping ---")
    data = scrape()

    # 2. Clean and format the scraped data
    print("\n--- Starting Cleaning ---")
    cleaned_data = clean(data)

    # 3. Ingest the cleaned data into Supabase (embeddings)
    print("\n--- Starting Ingestion ---")
    ingest(cleaned_data)

    print("\nAll tasks completed successfully!")

if __name__ == "__main__":
    main()