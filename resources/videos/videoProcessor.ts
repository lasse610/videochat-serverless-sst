import { SQSEvent, S3Event } from "aws-lambda";
import {
    S3Client,
    ListObjectsCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    AbortMultipartUploadCommandOutput,
    CompleteMultipartUploadCommandOutput
} from "@aws-sdk/client-s3";
import { PassThrough, Readable } from "stream";
import * as luxon from "luxon";
import { resolve } from "path";
import * as fs from "fs";
import { readdir, rm } from "fs/promises";
import { Serializable, spawn } from "child_process";
import path = require("path");
import { Upload } from "@aws-sdk/lib-storage";
import { updateCallHasVideoById } from "../common/database";
const region = process.env.region;
const videoFragmentBucket = process.env.videoFragmentBucket;
const hslBucket = process.env.hslBucket;
const client = new S3Client({ region });
const filepath = "./videos/tmp.webm";
const output = "./videos/output";

export async function handler(event: SQSEvent) {
    console.log(event);

    const sqsRecords = event.Records;

    // batch size should be 1
    for (const sqsRecord of sqsRecords) {
        const S3Records = JSON.parse(sqsRecord.body) as S3Event;

        if (S3Records.Records.length > 1) {
            console.log(S3Records);
            throw new Error("multiple S3 records, exiting");
        }
        for (const S3Record of S3Records.Records) {
            const startTime = luxon.DateTime.now();
            const finnishObject = S3Record.s3.object.key;
            const transformedObject = finnishObject.split("/");

            if (transformedObject.length !== 2) {
                return { statusCode: 400, body: "finnish object format not correct" };
            }
            const callId = transformedObject[0];
            const listObjectsCommand = new ListObjectsCommand({
                Bucket: videoFragmentBucket,
                Prefix: callId
            });
            const listObjectsResponse = await client.send(listObjectsCommand);

            // filter out finnish object
            const objects = listObjectsResponse.Contents?.filter(
                (obj) => obj.Key && !obj.Key.includes("FINNISH")
            ).map((obj) => obj.Key);
            if (!objects || objects.length === 0) {
                return { statusCode: 400, body: "no video fragments found" };
            }

            // check that the objects have names we can approve
            for (let i = 0; i < objects.length; i++) {
                if (objects.indexOf(`${callId}/${i}`) === -1) {
                    return {
                        statusCode: 400,
                        body: `no video fragments with index ${i} found for callId ${callId}`
                    };
                }
            }

            const resArray: Promise<GetObjectCommandOutput>[] = [];
            const keyObjectMap: Map<
        string,
        Promise<GetObjectCommandOutput>
      > = new Map();

            for (let i = 0; i < objects.length; i++) {
                const key = objects[i];
                if (!key) {
                    return { statusCode: 400, body: "error key is undefined" };
                }
                const index = key.split("/")[1];
                const command = client.send(
                    new GetObjectCommand({ Bucket: videoFragmentBucket, Key: objects[i] })
                );
                resArray.push(command);
                keyObjectMap.set(index, command);
                console.log(i);
            }

            const readable = new Readable();
            console.log("here");
            for (let i = 0; i < objects.length; i++) {
                const object = await keyObjectMap.get(`${i}`);
                if (!object) {
                    return {
                        statusCode: 400,
                        body: `object with index ${i} not delivered from s3`
                    };
                }
                const body = object.Body as Readable;
                // overwrite only on first
                const stream = fs.createWriteStream(filepath, {
                    flags: i == 0 ? "w" : "a"
                });
                await new Promise((resolve, reject) => {
                    body.pipe(stream);
                    stream.on("finish", () => {
                        console.log(`finished writablestream ${i}`);
                        resolve(1);
                    });
                    stream.on("error", () => {
                        reject("error in writable stream");
                    });
                });
            }

            await new Promise((resolve, rejects) => {
                const ffmpegProcess = spawn("ffmpeg", getFfmpegArgs(filepath, output));
                ffmpegProcess.addListener("exit", (code: number) => {
                    console.log(`finished with code ${code}`);
                    resolve(code);
                });
                ffmpegProcess.stdout.on("data", (chunk) => {
                    //console.log(chunk.toString());
                });

                ffmpegProcess.stderr.on("data", (chunk) => {
                    //console.log(chunk.toString());
                });

                ffmpegProcess.addListener("message", (msg: Serializable) => {
                    console.log(msg.toString());
                });

                ffmpegProcess.addListener("error", (err: Error) => {
                    rejects(err);
                });
            });

            const test = await getFiles(`${output}/`);
            await uploadFilesToS3(output, test, callId);
            await updateCallHasVideoById(callId, true);
            await rm(output, { recursive: true });
            await rm(filepath);
            console.log(
                `processing finished. Took ${startTime
                    .diffNow()
                    .negate()
                    .as("seconds")} seconds`
            );
        }
    }
    return { statusCode: 200, body: "success" };
}

function getFfmpegArgs(filePath: string, outdir: string) {
    const command = [
        "-i",
        filePath,
        "-filter_complex",
        "[0:v:0]split=3[v1][v2][v3]; [v1]scale=w=1920:h=1080[v1out]; [v2]scale=w=1280:h=720[v2out]; [v3]scale=w=640:h=360[v3out]",
        "-map",
        "[v1out]",
        "-c:v:0",
        "libx264",
        "-x264-params",
        "nal-hrd=cbr:force-cfr=1",
        "-b:v:0",
        "5M",
        "-maxrate:v:0",
        "5M",
        "-minrate:v:0",
        "5M",
        "-bufsize:v:0",
        "10M",
        "-preset",
        "slow",
        "-g",
        "48",
        "-sc_threshold",
        "0",
        "-keyint_min",
        "48",
        "-map",
        "[v2out]",
        "-c:v:1",
        "libx264",
        "-x264-params",
        "nal-hrd=cbr:force-cfr=1",
        "-b:v:1",
        "3M",
        "-maxrate:v:1",
        "3M",
        "-minrate:v:1",
        "3M",
        "-bufsize:v:1",
        "3M",
        "-preset",
        "medium",
        "-g",
        "48",
        "-sc_threshold",
        "0",
        "-keyint_min",
        "48",
        "-map",
        "[v3out]",
        "-c:v:2",
        "libx264",
        "-x264-params",
        "nal-hrd=cbr:force-cfr=1",
        "-b:v:2",
        "1M",
        "-maxrate:v:2",
        "1M",
        "-minrate:v:2",
        "1M",
        "-bufsize:v:2",
        "1M",
        "-preset",
        "slow",
        "-g",
        "48",
        "-sc_threshold",
        "0",
        "-keyint_min",
        "48",
        "-map",
        "a:0",
        "-c:a:0",
        "aac",
        "-b:a:0",
        "96k",
        "-ac",
        "2",
        "-map",
        "a:0",
        "-c:a:1",
        "aac",
        "-b:a:1",
        "96k",
        "-ac",
        "2",
        "-map",
        "a:0",
        "-c:a:2",
        "aac",
        "-b:a:2",
        "48k",
        "-ac",
        "2",
        "-f",
        "hls",
        "-hls_time",
        "2",
        "-hls_playlist_type",
        "vod",
        "-hls_flags",
        "independent_segments",
        "-hls_segment_type",
        "mpegts",
        "-hls_segment_filename",
        `${output}/stream_%v/data%02d.ts`,
        "-master_pl_name",
        "master.m3u8",
        "-var_stream_map",
        "v:0,a:0 v:1,a:1 v:2,a:2",
        `${output}/stream_%v.m3u8`
    ];
    return command;
}

async function getFiles(dir: string): Promise<string[]> {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        })
    );
    return files.flat();
}

async function uploadFilesToS3(
    dirname: string,
    files: string[],
    callId: string
) {
    const keys = files.map((file) => path.relative(dirname, file));
    const promiseArr: Promise<
    AbortMultipartUploadCommandOutput | CompleteMultipartUploadCommandOutput
  >[] = [];
    keys.forEach((key, index) => {
        const { writeStream, promise } = uploadStreamToS3(`${callId}/${key}`);
        const readstream = fs.createReadStream(files[index]);
        readstream.pipe(writeStream);
        promiseArr.push(promise);
    });

    function uploadStreamToS3(key: string) {
        const pass = new PassThrough();
        console.log(`starting upload of ${key}`);
        const upload = new Upload({
            client: client,
            params: { Bucket: hslBucket, Key: key, Body: pass }
        });
        return { writeStream: pass, promise: upload.done() };
    }

    await Promise.all(promiseArr);
    console.log("upload finished");
}
