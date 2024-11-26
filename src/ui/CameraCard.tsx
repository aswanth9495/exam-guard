'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select';
import { Camera } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';
import {
  selectSubStep,
  setSubStepError,
  setStepStatus,
} from '@/store/features/workflowSlice';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import CameraGuideDialog from './CameraGuideDialog';

export default function CameraSelector() {
  const dispatch = useAppDispatch();
  const proctor = useAppSelector((state) => selectProctor(state));
  const cameraState = useAppSelector((state) =>
    selectSubStep(state, 'cameraShare', 'cameraShare'),
  );

  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>(
    [],
  );
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    async function initializeCamera() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const availableCameras = await proctor?.getWebcamDevices();

        if (availableCameras && availableCameras.length > 0) {
          proctor?.setWebcamDevice(availableCameras[0].id);
          proctor?.handleWebcamRequest();
          setCameras(availableCameras);
          setSelectedCamera(availableCameras[0].id);
        }
      } catch (error) {
        setShowGuideModal(true);
        dispatch(
          setSubStepError({
            step: 'cameraShare',
            subStep: 'cameraShare',
            error: 'Camera permission denied',
          }),
        );
        dispatch(
          setStepStatus({
            step: 'cameraShare',
            status: 'error',
          }),
        );
      }
    }

    initializeCamera();
  }, [proctor, dispatch]);

  return (
    <div className='flex flex-col gap-4 items-center w-full max-w-4xl mx-auto'>
      <div className='overflow-hidden shadow-lg bg-white w-full p-6 space-y-6 rounded-2xl'>
        <div className='aspect-video bg-gray-100 rounded-lg flex items-center justify-center'>
          {cameraState.status === 'error' && (
            <div className='flex flex-col items-center gap-4 p-6 text-center'>
              <Camera className='w-16 h-16 text-red-400' strokeWidth={1.5} />
              <div className='space-y-2'>
                <p className='text-red-600 font-medium'>
                  Camera access is blocked
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

        {cameras.length > 0 && (
          <Select
            value={selectedCamera}
            onValueChange={setSelectedCamera}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Select a camera' />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((camera) => (
                camera.id ? (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.label || 'Unnamed Camera'}
                  </SelectItem>
                ) : null
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <p className='text-xs text-gray-600 font-bold italic'>
        Need help on sharing camera permissions?{' '}
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setShowGuideModal(true);
          }}
          className='text-blue-500 hover:underline'
        >
          Click to view
        </a>{' '}
        setup guide
      </p>

      <CameraGuideDialog
        open={showGuideModal}
        onOpenChange={setShowGuideModal}
        isError={cameraState.status === 'error'}
      />
    </div>
  );
}
