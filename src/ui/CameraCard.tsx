'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, ChevronDown, Video } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';
import {
  selectSubStep,
  setSubStepError,
} from '@/store/features/workflowSlice';
import { selectProctor } from '@/store/features/assessmentInfoSlice';

export default function CameraSelector() {
  const dispatch = useAppDispatch();
  const proctor = useAppSelector((state) => selectProctor(state));
  const cameraState = useAppSelector((state) =>
    selectSubStep(state, 'cameraShare', 'cameraShare'),
  );

  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);

  const initializeCamera = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const availableCameras = await proctor?.getWebcamDevices();

      if (availableCameras && availableCameras.length > 0) {
        setCameras(availableCameras);
        setSelectedCamera(availableCameras[0].id);
        proctor?.setWebcamDevice(availableCameras[0].id);
        proctor?.handleWebcamRequest();
      }
    } catch (error) {
      dispatch(
        setSubStepError({
          step: 'cameraShare',
          subStep: 'cameraShare',
          error: 'Camera permission denied',
        }),
      );
    }
  }, [proctor, dispatch]);

  useEffect(() => {
    initializeCamera();
  }, [initializeCamera]);

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
    if (proctor) {
      proctor.setWebcamDevice(cameraId);
      proctor.handleWebcamRequest();
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center w-full max-w-5xl mx-auto'>
      <div className='overflow-hidden shadow-lg bg-white w-full pb-6 space-y-6 rounded-2xl'>
        <div className='aspect-video bg-gray-100 rounded-lg flex items-center justify-center'>
          {cameraState.status === 'error' && (
            <div
              className='flex flex-col items-center gap-4 p-6 text-center cursor-pointer'
              onClick={initializeCamera}
            >
              <Camera className='w-16 h-16 text-red-400' strokeWidth={1.5} />
              <div className='space-y-2'>
                <p className='text-red-600 font-medium'>
                  Camera access is blocked. Follow the steps below to fix it.
                </p>
              </div>
            </div>
          )}
          <video
            id='webcam'
            className={`w-full h-full object-cover rounded-lg ${
              cameraState.status === 'completed' ? 'block' : 'hidden'
            }`}
            autoPlay
            playsInline
          />
        </div>

        <div className="relative mx-8 mt-">
          <select
            id="camera-select"
            value={selectedCamera}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="w-full text-sm appearance-none rounded-lg border border-gray-300 bg-white py-4 pl-16 pr-8 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="" disabled selected={!selectedCamera}>
              Select Camera Input
            </option>
            {cameras?.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || 'Unnamed Camera'}
              </option>
            ))}
          </select>
          <Video className="w-8 h-8 fill-black absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-8 h-8 text-gray-500 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
