import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";

/*
  Pinecone client
*/

const getPineconeClient = () =>
  new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

const getEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

const getQueryEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_QUERY,
  });

/*
  Ingest PDF
*/

export async function ingestPdf({
  fileId,
  fileUrl,
}: {
  fileId: string;
  fileUrl: string;
}): Promise<void> {
  console.log(`🚀 [${fileId}] Starting ingestion...`);

  // 1. Download PDF
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download PDF: ${response.status} ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  console.log(
    `✅ [${fileId}] PDF size: ${(arrayBuffer.byteLength / 1024).toFixed(1)} KB`,
  );

  // 2. Parse PDF
  const loader = new PDFLoader(new Blob([arrayBuffer]));
  const pageDocs = await loader.load();
  if (pageDocs.length === 0) {
    throw new Error(`PDF parsed but no pages found for fileId: ${fileId}`);
  }
  console.log(`✅ [${fileId}] Loaded ${pageDocs.length} pages`);

  // 3. Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitDocuments(pageDocs);
  if (chunks.length === 0) {
    throw new Error(`No chunks created from PDF for fileId: ${fileId}`);
  }
  console.log(`✅ [${fileId}] Created ${chunks.length} chunks`);

  // 4. Attach fileId to metadata
  const docsWithMeta = chunks.map(
    (chunk) =>
      new Document({
        pageContent: chunk.pageContent,
        metadata: { ...chunk.metadata, fileId },
      }),
  );

  // 5. Embed and upsert via PineconeStore
  const index = getPineconeClient().index(process.env.PINECONE_INDEX!);
  await PineconeStore.fromDocuments(docsWithMeta, getEmbeddings(), {
    pineconeIndex: index,
    namespace: fileId,
  });

  console.log(
    `🎉 [${fileId}] Ingestion complete — ${chunks.length} chunks stored`,
  );
}

/*
  Query
*/

export async function getRelevantContext(
  query: string,
  fileId: string,
): Promise<string> {
  const index = getPineconeClient().index(process.env.PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(
    getQueryEmbeddings(),
    {
      pineconeIndex: index,
      namespace: fileId,
    },
  );

  const results = await vectorStore.similaritySearch(query, 5);

  if (results.length === 0) return "";

  // Include page numbers in the context so the AI can cite correctly
  return results
    .map((r) => {
      const pageNum =
        r.metadata?.["loc.pageNumber"] || r.metadata?.pageNumber || "unknown";
      return `[Page ${pageNum}]: ${r.pageContent}`;
    })
    .join("\n\n---\n\n");
}
