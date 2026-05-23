import json
import os
import sys
from pathlib import Path

# Attempt to load required libraries, guide user if not installed
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from sentence_transformers import SentenceTransformer
    import psycopg2
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Please install requirements: pip install langchain-text-splitters sentence-transformers psycopg2-binary python-dotenv")
    sys.exit(1)

# Load environment variables
dotenv_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(dotenv_path)

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("Error: DATABASE_URL is missing. It should be set as a GitHub Actions secret containing the Supabase connection string.")
    sys.exit(1)

conn = psycopg2.connect(db_url)

def ingest(data):
    # 1. Text Splitter
    print("Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,
        chunk_overlap=128,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = []
    for doc in data:
        splits = text_splitter.split_text(doc["content"])
        for i, split in enumerate(splits):
            chunks.append({
                "content": split,
                "metadata": {
                    "source": doc.get("source", "Unknown"),
                    "chunk_id": f"{doc.get('id', 'doc')}_{i}"
                }
            })

    # Process members.json if it exists
    members_path = os.path.join(os.path.dirname(__file__), '..', 'members.json')
    if os.path.exists(members_path):
        print("Processing members data...")
        with open(members_path, "r", encoding="utf-8") as f:
            members_data = json.load(f)

        for i, member in enumerate(members_data):
            name = f"{member.get('firstName', '')} {member.get('lastName', '')}".strip()
            role = member.get('teamRole', 'Unknown Role')
            study = member.get('fieldOfStudy', 'Unknown Field')
            year = member.get('schoolYear', '')
            joined = member.get('yearJoined', '')
            email = member.get('schoolEmail', '')
            about = member.get('about', '')
            linkedin = member.get('linkedIn', '')

            content = f"Team Member: {name}\nRole: {role}\nField of Study: {study} (Year: {year})\nJoined Team in: {joined}\nEmail: {email}\nAbout: {about}\nLinkedIn: {linkedin}"

            chunks.append({
                "content": content,
                "metadata": {
                    "source": "members.json",
                    "chunk_id": f"member_{i}"
                }
            })

    print(f"Total chunks created: {len(chunks)}")

    # 2. Generate Embeddings locally (no API key needed)
    print("Loading embedding model (all-MiniLM-L6-v2: 384 dimensions)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')

    texts = [chunk["content"] for chunk in chunks]
    print("Computing embeddings...")
    embeddings = model.encode(texts, show_progress_bar=True)

    # 3. Store in local PostgreSQL
    print("Storing vectors in local PostgreSQL...")
    cur = conn.cursor()

    # Clear old data so re-runs don't duplicate
    cur.execute("DELETE FROM documents")

    for i, chunk in enumerate(chunks):
        embedding_list = embeddings[i].tolist()
        cur.execute(
            "INSERT INTO documents (content, metadata, embedding) VALUES (%s, %s, %s)",
            (chunk["content"], json.dumps(chunk["metadata"]), str(embedding_list))
        )

    conn.commit()
    cur.close()
    print(f"Success! {len(chunks)} documents stored in local PostgreSQL.")


if __name__ == "__main__":
    pass
