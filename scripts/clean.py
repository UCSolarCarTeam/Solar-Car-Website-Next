import json
import re
import os

INPUT_PATH = "/tmp/documents.json"
OUTPUT_PATH = "/tmp/documents_clean.json"

# --- Patterns to strip ---

# Image markdown: ![alt](url)
IMAGE_PATTERN = re.compile(r'!\[.*?\]\(.*?\)')

# Inline links: [text](url) -> keep just the text
INLINE_LINK_PATTERN = re.compile(r'\[([^\]]+)\]\([^\)]+\)')

# Reference-style links and bare URLs in angle brackets
REF_LINK_PATTERN = re.compile(r'\[.*?\]\[.*?\]')

# The repeated footer block that appears in every Calgary Solar Car page
FOOTER_MARKERS = [
    "Follow us on our Social Media",
    "Contact Information",
    "communications@calgarysolarcar.ca",
    "sponsorship@calgarysolarcar.ca",
    "ENC 36, Schulich School of Engineering",
    "© 2026 Calgary Solar Car",
]

# Wikipedia boilerplate sections to drop entirely (these appear as headings)
WIKIPEDIA_DROP_SECTIONS = [
    "## References",
    "## External links",
    "## See also",
]

# Wikipedia navigation tables that are pure link noise
# These large navbox tables start with "| [Photovoltaics]" or "| [Energy]" etc.
NAVBOX_PATTERN = re.compile(
    r'\| \[(?:Photovoltaics|Energy|Electric vehicles|Alternative fuel vehicles|'
    r'The Sun|Natural resources|World Solar Challenge|American Solar Challenge|'
    r'Formula Sun Grand Prix|University of Calgary)\].*',
    re.DOTALL
)

# Wikipedia citation noise: [\1], [^1], \[1\], etc.
CITATION_PATTERN = re.compile(r'\[\\?\^?\\?\d+\\?\]')

# Escaped brackets from markdown conversion
ESCAPED_BRACKET_PATTERN = re.compile(r'\\[\[\]]')


def strip_footer(text: str) -> str:
    """Remove the repeated Calgary Solar Car footer from a document."""
    for marker in FOOTER_MARKERS:
        idx = text.find(marker)
        if idx != -1:
            # Walk back to find the start of the footer block
            text = text[:idx].rstrip()
            break
    return text


def strip_wikipedia_boilerplate(text: str) -> str:
    """Remove References, External links, See also sections and navboxes."""
    for section_header in WIKIPEDIA_DROP_SECTIONS:
        idx = text.find(section_header)
        if idx != -1:
            text = text[:idx].rstrip()
            break

    # Remove navbox tables (large repeated link blocks at the end)
    text = NAVBOX_PATTERN.sub("", text)
    return text


def clean_text(text: str, source: str) -> str:
    # 1. Strip image markdown
    text = IMAGE_PATTERN.sub("", text)

    # 2. Strip citations like [1], [^2], \[3\]
    text = CITATION_PATTERN.sub("", text)
    text = ESCAPED_BRACKET_PATTERN.sub("", text)

    # 3. Source-specific cleanup
    if "calgarysolarcar.ca" in source:
        text = strip_footer(text)

    if "wikipedia.org" in source:
        text = strip_wikipedia_boilerplate(text)
        # Convert inline links to plain text for Wikipedia
        text = INLINE_LINK_PATTERN.sub(r'\1', text)
        text = REF_LINK_PATTERN.sub("", text)

    # 4. Collapse excessive blank lines (more than 2 in a row -> 2)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # 5. Strip leading/trailing whitespace
    text = text.strip()

    return text


def is_empty_doc(text: str) -> bool:
    """Return True if the document has no meaningful content after cleaning."""
    # Remove all markdown, whitespace, and punctuation
    stripped = re.sub(r'[#\s\-\*_>|]', '', text)
    return len(stripped) < 100


def clean(docs):
    print(f"Cleaning {len(docs)} documents.")

    cleaned_docs = []
    skipped = []

    for doc in docs:
        source = doc.get("source", "")
        original_text = doc.get("content", "")
        cleaned_text = clean_text(original_text, source)

        if is_empty_doc(cleaned_text):
            skipped.append(source)
            print(f"  SKIPPED (empty after cleaning): {source}")
            continue

        original_len = len(original_text)
        cleaned_len = len(cleaned_text)
        reduction = 100 * (1 - cleaned_len / original_len) if original_len > 0 else 0

        print(f"  OK: {source}")
        print(f"      {original_len:,} chars -> {cleaned_len:,} chars ({reduction:.1f}% reduction)")

        cleaned_docs.append({
            "id": doc.get("id"),
            "content": cleaned_text,
            "source": source,
        })

    print(f"\nDone. {len(cleaned_docs)} documents cleaned.")
    if skipped:
        print(f"Skipped {len(skipped)} empty documents: {skipped}")
        
    return cleaned_docs

if __name__ == "__main__":
    pass