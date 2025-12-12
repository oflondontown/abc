import axios from "axios";

export type InitResponse = {
  uploadId: string;
  chunkSize: number;
  totalChunks: number;
};

export async function initUpload(
  filename: string,
  totalSize: number
): Promise<InitResponse> {
  const res = await axios.post("/api/upload/octet/init", {
    filename,
    totalSize,
  });

  return res.data; // { uploadId, chunkSize, totalChunks }
}

export async function uploadOctetChunk(
  uploadId: string,
  chunk: Blob,
  chunkIndex: number,
  filename: string,
  checksum?: string
) {
  return axios.post(`/api/upload/octet/chunk`, chunk, {
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Upload-Id": uploadId,
      "X-Chunk-Index": chunkIndex.toString(),
      "X-Chunk-Size": chunk.size.toString(),
      "X-Original-Filename": encodeURI(filename),
      "X-Chunk-Checksum": checksum || "",
    },
  });
}

export async function completeUpload(uploadId: string) {
  return axios.post("/api/upload/octet/complete", { uploadId });
}

export async function checkUploadStatus(uploadId: string) {
  return axios.get(`/api/upload/status?uploadId=${uploadId}`);
}

/**
 * Run async tasks with limited concurrency
 * @param tasks Array of functions returning Promises
 * @param limit Max number of concurrent tasks
 */
export async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<void> {
  let index = 0;

  // worker runs until all tasks are consumed
  const worker = async () => {
    while (index < tasks.length) {
      const current = index++;
      try {
        await tasks[current]();
      } catch (err) {
        console.error("Task failed:", err);
        throw err; // optionally rethrow to stop all uploads on failure
      }
    }
  };

  // start `limit` workers in parallel
  await Promise.all(Array.from({ length: limit }, () => worker()));
}

export async function hashChunkSHA256(chunk: Blob): Promise<string> {
  const buffer = await chunk.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
