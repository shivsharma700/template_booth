'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@nextui-org/react';
import { useCameraStore } from '@/store/useCameraStore';
import { usePageStore } from '@/store/usePageStore';
import { useAIPhotoBoothStore } from '@/store/useAIPhotoBoothStore';
import { dataURItoBlob } from '@/utils/blob';
import SettingsDropdown from './SettingsDropdown';
import { CameraIcon } from '@/components/common/Icons';
import UploadComponent from '@/components/common/UploadComponent';
import { useImageDropHandler } from './ImageDrop';

const CameraComponent: React.FC = () => {
  const {setImageFile } = useAIPhotoBoothStore();
  const [isWebcamClicked, setIsWebcamClicked] = useState(false);
  const { currentPageIndex, setCurrentPage } = usePageStore();
  const onImageDrop = useImageDropHandler();
  const {
    remainingTime,
    setRemainingTime,
    frontCamera,
    mirrored,
    zoom,
    setZoom,
    capturedImageData,
    setCapturedImageData,
  } = useCameraStore();
  const webcamRef = useRef<Webcam>(null);

  const handleNext = useCallback(() => {
    setCurrentPage(currentPageIndex + 1);
  }, [currentPageIndex, setCurrentPage]);

  useEffect(() => {
    if (remainingTime) {
      setTimeout(() => {
        capture();
      }, remainingTime * 1000);
      setRemainingTime(0);
    }
  }, [remainingTime]);

  useEffect(() => {
    const videoElement = webcamRef.current?.video;
    if (videoElement) {
      videoElement.style.transform = `scale(${zoom})`;
    }
  }, [zoom]);

  const capture = useCallback(() => {
    setIsWebcamClicked(true);
    const video = webcamRef.current?.video;
    if (video) {
      const scale = zoom; // This is your zoom level
      const width = video.videoWidth / scale;
      const height = video.videoHeight / scale;
      const x = (video.videoWidth - width) / 2;
      const y = (video.videoHeight - height) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, x, y, width, height, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg');
        const blob = dataURItoBlob(imageSrc);
        setImageFile(blob);
        setCapturedImageData({
          src: imageSrc,
          width: canvas.width,
          height: canvas.height,
          mirrored: mirrored,
        });
      }
    }
  }, [mirrored, setCapturedImageData, zoom]);

  const reset = useCallback(() => {
    setCapturedImageData(null);
    setZoom(1);
  }, [setCapturedImageData]);


  return (
    <>
      {capturedImageData ? (
        <div className={`mt-20 lg:mt-0 rounded-lg shadow-xl backdrop-blur-md ${isWebcamClicked?'aspect-portrait':''} overflow-hidden`}>
          <img src={capturedImageData.src || ''}  alt="Captured" className="w-[650px] h-full rounded-lg object-cover" />
        </div>
      ) : (
        <div className=" mt-20 lg:mt-0 rounded-lg shadow-xl bg-red-300 backdrop-blur-md aspect-portrait overflow-hidden">
          <Webcam
            audio={false}
            mirrored={mirrored}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className=" w-full h-full rounded-lg object-cover"
            videoConstraints={{ facingMode: frontCamera ? 'user' : 'environment' }}
            width={500}
          />
        </div>
      )}
      <div className="flex justify-center items-center gap-4 mt-4">
        {capturedImageData ? (
          <div className="flex gap-4">
            <Button variant="faded" className="rounded-full h-20 w-20 text-lg font-semibold " onClick={reset}>
              Prev
            </Button>
            <Button variant="faded" className="rounded-full h-20 w-20 text-lg font-semibold " onClick={handleNext}>
              Next
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-row">
            <UploadComponent
              onDrop={onImageDrop}
            />
            <Button
              startContent={<CameraIcon />}
              className="rounded-full h-20 w-20 text-lg font-semibold "
              onClick={capture}
            />
            <SettingsDropdown />
          </div>
        )}
      </div>
    </>
  );
};

export default CameraComponent;
