import json
import requests
import os


url = "https://api.firecrawl.dev/v1/scrape"

target_urls = [
    "https://calgarysolarcar.ca",
    "https://calgarysolarcar.ca/cars",
    "https://calgarysolarcar.ca/team",
    "https://calgarysolarcar.ca/our-work",
    "https://calgarysolarcar.ca/recruitment",
    "https://calgarysolarcar.ca/sponsors",
    "https://en.wikipedia.org/wiki/University_of_Calgary_Solar_Car_Team",
    "https://en.wikipedia.org/wiki/American_Solar_Challenge",
    "https://en.wikipedia.org/wiki/World_Solar_Challenge",
    "https://en.wikipedia.org/wiki/Formula_Sun_Grand_Prix",
    "https://en.wikipedia.org/wiki/Solar_car",
    "https://en.wikipedia.org/wiki/Solar_energy",
]

def scrape():
    documents = []
    for i, target in enumerate(target_urls):
        print("Scraping:", target)

        try:
            response = requests.post(
                url,
                headers={
                    "Authorization": f"Bearer {os.getenv('FC_API_KEY')}",
                    "Content-Type": "application/json"
                },      
                json={
                    "url": target,
                    "formats": ["markdown"]
                },
                timeout=30
            )
            response.raise_for_status()
            data = response.json()

            if data and "data" in data and "markdown" in data["data"]:
                markdown_content = data["data"]["markdown"]
                if markdown_content:
                    documents.append({
                        "id": f"doc_{i}",
                        "content": markdown_content,
                        "source": target
                    })
                else:
                    print(f"Warning: Empty markdown content returned for {target}")
            else:
                print(f"Warning: Expected data structure missing in response for {target}. Response: {data}")

        except requests.exceptions.Timeout:
            print(f"Error: Timeout occurred while scraping {target}")
        except requests.exceptions.JSONDecodeError:
            print(f"Error: Failed to parse JSON response for {target}")
        except requests.exceptions.RequestException as e:
            print(f"Error: Network or HTTP exception occurred for {target}: {e}")
        except Exception as e:
            print(f"Error: An unexpected error occurred while processing {target}: {e}")

    print("Done. Scraping completed.")
    return documents

if __name__ == "__main__":
    scrape()