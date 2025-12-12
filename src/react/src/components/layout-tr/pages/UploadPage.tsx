import React, { useCallback, useState } from "react";
import { startUpload, uploadChunk, finishUpload } from "../api/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  checkUploadStatus,
  completeUpload,
  InitResponse,
  initUpload,
  hashChunkSHA256,
  parallelLimit,
  uploadOctetChunk,
} from "@/api/upload-octet";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

// import { Dropzone } from "@/components/ui/dropzone";

const uploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "Please select at least one file"),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  const MAX_PARALLEL = 5; // allow 5 concurrent uploads
  const MAX_RETRIES = 3; // max attempts per chunk

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setProgress(0);
    }
  };

  // const handleUpload = async () => {
  //   if (!file) return;
  //   setUploading(true);
  //   const CHUNK_SIZE = 5 * 1024 * 1024;

  //   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  //   const { uploadId } = await startUpload(file.name, totalChunks);

  //   for (let index = 0; index < totalChunks; index++) {
  //     const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);

  //     await uploadChunk(uploadId, chunk, index);

  //     const percent = Math.round(((index + 1) / totalChunks) * 100);
  //     setProgress(percent);
  //   }

  //   await finishUpload(uploadId);
  //   setUploading(false);
  //   alert("Upload complete!");
  // };

  const uploadChunkWithRetry = async (
    uploadId: string,
    chunk: Blob,
    chunkIndex: number,
    filename: string,
    checksum?: string
  ) => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await uploadOctetChunk(uploadId, chunk, chunkIndex, filename, checksum);
        return; // success
      } catch (err) {
        console.warn(`Chunk ${chunkIndex} failed attempt ${attempt}`, err);
        if (attempt === MAX_RETRIES) throw err;
        await new Promise((r) => setTimeout(r, attempt * 500)); // exponential backoff
      }
    }
  };

  const handleOctetUpload = async () => {
    if (!file) return;
    setUploading(true);

    let initJson = localStorage.getItem(`uploadId_${file.name}`);
    let uploadedChunks: number[] = [];

    let init: InitResponse;
    if (!initJson) {
      init = await initUpload(file.name, file.size);
      localStorage.setItem(`uploadId_${file.name}`, JSON.stringify(init));

      console.log(
        `Got: ${JSON.stringify(init)} for uploading ${file.size} mb for ${
          file.name
        }...`
      );
    } else {
      init = JSON.parse(initJson) as InitResponse;

      // query backend for existing uploaded chunks
      const res = await checkUploadStatus(
        `/api/upload/status?uploadId=${init.uploadId}`
      );
      uploadedChunks = res.data.uploadedChunks || [];
    }

    let completed = uploadedChunks.length;

    const chunkSize = init.chunkSize;
    const totalChunks = init.totalChunks;

    const chunkIndexes = [...Array(totalChunks).keys()].filter(
      (idx) => !uploadedChunks.includes(idx)
    );

    const uploadTask = async (index: number) => {
      const start = index * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      // compute checksum
      const checksum = await hashChunkSHA256(chunk);

      await uploadChunkWithRetry(
        init.uploadId,
        chunk,
        index,
        file.name,
        checksum
      );

      completed++;
      setProgress(Math.round((completed / totalChunks) * 100));
    };

    const chunkTasks = chunkIndexes.map((idx) => () => uploadTask(idx));
    try {
      await parallelLimit(chunkTasks, MAX_PARALLEL);

      // Complete upload
      await completeUpload(init.uploadId);
      localStorage.removeItem(`uploadId_${file.name}`);
      setProgress(100);
      alert("Upload completed successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(
        "Upload failed. Some chunks may be retried automatically on next attempt."
      );
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------
  // ---------------------------------------------------------

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      files: [],
    },
  });

  // const {
  //   fields: videoFields,
  //   append: appendVideo,
  //   remove: removeVideo,
  // } = useFieldArray({
  //   name: "files",
  //   control: form.control,
  // });

  // const handleOnDropzone = useCallback(
  //   async (acceptedFiles: File[]) => {
  //     appendVideo(
  //       acceptedFiles.map((file) => {
  //         console.log(`Accepting files: ${file.name}`);
  //         return { value: file };
  //       })
  //     );
  //     await form.trigger("files");
  //   },
  //   [form]
  // );

  const onSubmit = async (data: UploadFormValues) => {
    console.log("Submitting...");
    setFile(data.files[0]);
    handleOctetUpload();
    // alert(
    //   `You submitted the following values: ${JSON.stringify(data, null, 2)}`
    // );
  };

  const [errors, setErrors] = useState<string>();
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Video Upload</h1>
      </div>

      <div className="p-4 max-w-xl mx-auto flex">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input id="video" type="file" onChange={handleFileSelect} />

          <Button
            size={"sm"}
            variant={"default"}
            onClick={handleOctetUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {uploading && (
          <div className="mt-4">
            <div>Uploading... {progress}%</div>
            <Progress value={progress} className="w-[60%]" />
          </div>
        )}
      </div>

      <div className="flex w-full max-w-sm items-center gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="files"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Upload files</FormLabel>
                  <FormControl>
                    {/* <Dropzone
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error}
                    /> */}

                    <Dropzone
                      accept={{ "video/*": [] }}
                      maxFiles={10}
                      // maxSize={1024 * 1024 * 10}
                      minSize={1024}
                      onDrop={field.onChange}
                      onError={(error) => setErrors(error.message)}
                      className={"cursor-pointer"}
                      src={field.value ?? []}
                    >
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="sm"
              variant="default"
              className="cursor-pointer"
            >
              Upload Form Data
            </Button>
          </form>
        </Form>
        {/* <div className="mt-2 grid grid-cols-5 gap-2">
          {videoFields.map((field, index) => (
            <div key={field.id} className="space-y-2">
              {URL.createObjectURL(field.value)}
              <Button
                variant="destructive"
                onClick={() => removeVideo(index)}
                size="sm"
                type="button"
                className="w-full"
              >
                Remove Video
              </Button>
            </div>
          ))}
        </div>
        <div>{errors}</div> */}
      </div>
    </div>
  );
}
