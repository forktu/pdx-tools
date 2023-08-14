import { AwsClient } from "aws4fetch";
import { getEnv } from "./env";
import { log } from "./logging";
import { uploadContentType, UploadType } from "./models";
import { timeit } from "@/lib/timeit";

export const BUCKET = getEnv("S3_BUCKET");
const defaultHeaders = { service: "s3", region: getEnv("S3_REGION") };

const s3client = new AwsClient({
  accessKeyId: getEnv("S3_ACCESS_KEY"),
  secretAccessKey: getEnv("S3_SECRET_KEY"),
  region: getEnv("S3_REGION"),
});

export async function s3Fetch(...args: Parameters<(typeof s3client)["fetch"]>) {
  return args[0] instanceof Request
    ? s3client.fetch(...args)
    : s3client.fetch(new URL(args[0], getEnv("S3_ENDPOINT")).toString(), {
        ...args[1],
        aws: { ...defaultHeaders, ...args[1]?.aws },
      });
}

export async function s3FetchOk(
  ...args: Parameters<(typeof s3client)["fetch"]>
) {
  const res = await s3Fetch(...args);
  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res;
}

export async function s3Presigned(saveId: string): Promise<string> {
  const url = new URL(`${BUCKET}/${saveId}`, getEnv("S3_ENDPOINT"));
  url.searchParams.set("X-Amz-Expires", "3600");
  const req = await s3client.sign(url.toString(), {
    aws: { ...defaultHeaders, signQuery: true },
  });
  return req.url;
}

export async function uploadFileToS3(
  body: Buffer,
  filename: string,
  upload: UploadType,
): Promise<void> {
  const contentType = uploadContentType(upload);
  const put = await timeit(() =>
    s3FetchOk(`${BUCKET}/${filename}`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": contentType,
      },
    }),
  );

  log.info({
    msg: "uploaded a new file to s3",
    key: filename,
    bytes: body.length,
    elapsedMs: put.elapsedMs.toFixed(2),
  });
}

export async function deleteFile(saveId: string): Promise<void> {
  await s3FetchOk(`${BUCKET}/${saveId}`, {
    method: "DELETE",
  });
  log.info({ msg: "deleted s3 file", saveId });
}
