import time
import os
import sys

# Add the project root to sys.path to allow importing from the 'scripts' package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.scrape import scrape
from scripts.clean import clean
from scripts.ingest import ingest

def get_memory_usage():
    """Returns the current memory usage in MB."""
    try:
        import resource
        # ru_maxrss is in KB on Linux
        return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024
    except ImportError:
        # Fallback for Windows if psutil is installed, otherwise 0
        try:
            import psutil
            process = psutil.Process(os.getpid())
            return process.memory_info().rss / (1024 * 1024)
        except ImportError:
            return 0

def main():
    start_total = time.perf_counter()
    
    # 1. Scrape data from websites
    print("\n--- Starting Scraping ---")
    t0 = time.perf_counter()
    data = scrape()
    t_scrape = time.perf_counter() - t0

    # 2. Clean and format the scraped data
    print("\n--- Starting Cleaning ---")
    t0 = time.perf_counter()
    cleaned_data = clean(data)
    t_clean = time.perf_counter() - t0

    # 3. Ingest the cleaned data into Supabase (embeddings)
    print("\n--- Starting Ingestion ---")
    t0 = time.perf_counter()
    ingest(cleaned_data)
    t_ingest = time.perf_counter() - t0

    end_total = time.perf_counter()
    total_duration = end_total - start_total
    memory_used = get_memory_usage()

    print("\n" + "="*40)
    print("      AWS RESOURCE USAGE REPORT")
    print("="*40)
    print(f"Scraping Duration:    {t_scrape:7.2f}s")
    print(f"Cleaning Duration:    {t_clean:7.2f}s")
    print(f"Ingestion Duration:   {t_ingest:7.2f}s")
    print("-" * 40)
    print(f"Total Execution Time: {total_duration:7.2f}s")
    print(f"Peak Memory Usage:    {memory_used:7.2f} MB")
    print(f"Documents Processed:  {len(data):7d}")
    print("="*40)
    print("\nAll tasks completed successfully!")

if __name__ == "__main__":
    main()