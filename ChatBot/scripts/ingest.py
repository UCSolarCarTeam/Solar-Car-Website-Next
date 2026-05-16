import json
import os
import sys
from pathlib import Path
# Attempt to load required libraries, guide user if not installed
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from sentence_transformers import SentenceTransformer
    from supabase import create_client, Client
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Please install requirements: pip install langchain langchain-community sentence-transformers supabase python-dotenv")
    sys.exit(1)

# Load environment variables
dotenv_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(dotenv_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not url or not key:
    print("Error: Supabase URL or Supabase key is missing in .env.local. For ingestion, set `SUPABASE_SERVICE_ROLE_KEY`.")
    sys.exit(1)

supabase: Client = create_client(url, key)

def ingest(data):
    # 1. Documents are already loaded in memory via `data` parameter

    # 2. Text Splitter
    print("Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=64,
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

    # 3. Generate Embeddings locally to save money & avoid API limits
    print("Loading embedding model (all-MiniLM-L6-v2: 384 dimensions)...")
    # Using an efficient, free local model for 384 dimensions
    model = SentenceTransformer('all-MiniLM-L6-v2') 
    
    texts = [chunk["content"] for chunk in chunks]
    print("Computing embeddings...")
    embeddings = model.encode(texts, show_progress_bar=True)

    # 4. Store in Supabase
    print("Storing vectors in Supabase...")
    for i, chunk in enumerate(chunks):
        embedding_list = embeddings[i].tolist()
        
        # Insert row into Supabase pgvector table
        response = supabase.table('documents').insert({
            "content": chunk["content"],
            "metadata": chunk["metadata"],
            "embedding": embedding_list
        }).execute()

    print("Success! All documents have been embedded and stored in Supabase.")

if __name__ == "__main__":
    pass
