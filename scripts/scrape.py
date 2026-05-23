import json
import requests
import os

API_KEY = "fc-d48497bc351b4bb1abf1976a5587bb2e"

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

        response = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },      
            json={
                "url": target,
                "formats": ["markdown"]
            }
        )

        data = response.json()

        documents.append({
            "id": f"doc_{i}",
            "content": data["data"]["markdown"],
            "source": target
        })

    print("Done. Scraping completed.")
    return documents

if __name__ == "__main__":
    scrape()