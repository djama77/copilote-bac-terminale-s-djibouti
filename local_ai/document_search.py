"""Recherche documentaire locale : extraits de PDF/TXT avec pages et scores simples."""
from io import BytesIO
import re
import unicodedata
from pypdf import PdfReader

MAX_FILE_BYTES = 5 * 1024 * 1024
MAX_PAGES = 80
MAX_CHARS = 200_000

def normalize(value):
    value = unicodedata.normalize("NFKD", value.lower())
    return "".join(c for c in value if not unicodedata.combining(c))

def chunks_from_upload(upload):
    if upload.size > MAX_FILE_BYTES:
        raise ValueError("Fichier supérieur à 5 Mo")
    name = upload.name
    data = upload.getvalue()
    if name.lower().endswith(".pdf"):
        reader = PdfReader(BytesIO(data))
        pages = [(i + 1, p.extract_text() or "") for i, p in enumerate(reader.pages[:MAX_PAGES])]
    elif name.lower().endswith(".txt"):
        pages = [(1, data.decode("utf-8"))]
    else:
        raise ValueError("Format non accepté")
    output = []
    used = 0
    for page, text in pages:
        text = " ".join(text.split())
        remaining = MAX_CHARS - used
        if remaining <= 0:
            break
        text = text[:remaining]
        used += len(text)
        for start in range(0, len(text), 1000):
            snippet = text[start:start + 1200]
            if snippet.strip():
                output.append({"file": name, "page": page, "text": snippet})
    return output

def search(question, chunks, limit=4):
    terms = set(re.findall(r"[a-z0-9]{3,}", normalize(question)))
    stop = {"les", "des", "une", "dans", "pour", "avec", "sur", "que", "est", "qui", "comment", "quoi", "cours"}
    terms -= stop
    scored = []
    for chunk in chunks:
        content = normalize(chunk["text"])
        score = sum(content.count(term) for term in terms)
        if score:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]
