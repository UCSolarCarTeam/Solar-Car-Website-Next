-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists documents (
    id bigserial primary key,
    content text,
    metadata jsonb,
    embedding vector(384) -- Using 384 dimensions for all-MiniLM-L6-v2 embedding model
);

-- Create a function to search for documents
create or replace function match_documents (
    query_embedding vector(384),
    match_threshold float,
    match_count int
)
returns table (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
)
language sql stable
as $$
    select
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) as similarity
    from
        documents
    where
        1 - (documents.embedding <=> query_embedding) > match_threshold
    order by
        similarity desc
    limit
        match_count;
$$;
