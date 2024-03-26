import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',//'testing-vectordb-c1go65b0.weaviate.network',
    headers: { 'X-Cohere-Api-Key': 'kU7o4Fif6mNsFpiSzsr5YpN08Jhy7f6fPYLfrwGI', 'X-HuggingFace-Api-Key': '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' }
  });

export {client}
