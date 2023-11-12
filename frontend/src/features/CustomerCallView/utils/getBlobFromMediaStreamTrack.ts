import React from 'react';

export default function getBlobFromMediaTrack(
  track: MediaStreamTrack,
  videoRef: React.MutableRefObject<HTMLVideoElement | null>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) {
  if (true) {
    const videoTrack = track;
    const imageCapture = new ImageCapture(videoTrack);
    return imageCapture.takePhoto();
  } else {
    if (!videoRef.current || !canvasRef.current) return Promise.reject();
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');

    video.srcObject = new MediaStream([track]);

    return new Promise((resolve, reject) => {
      video.addEventListener('loadeddata', async () => {
        const { videoWidth, videoHeight } = video;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        try {
          await video.play();
          context?.drawImage(video, 0, 0, videoWidth, videoHeight);
          canvas.toBlob(resolve, 'image/png');
          video.srcObject = null; // cleanup
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}