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
import { detectWebcam, getAvailableCameras } from '@/utils/webcam';
import { useAppDispatch } from '@/hooks/reduxhooks';
import {
  setSubStepStatus,
  setSubStepError,
  setStepStatus,
} from '@/store/features/workflowSlice';
import CameraGuideDialog from './CameraGuideDialog';

export default function CameraSelector() {
  const dispatch = useAppDispatch();
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [webcamStatus, setWebcamStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>('prompt');

  const handleCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });

      const availableCameras = await getAvailableCameras();
      setCameras(availableCameras);

      if (availableCameras.length > 0) {
        setSelectedCamera(availableCameras[0].id);
        setWebcamStatus('ready');
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setWebcamStatus('error');
      setShowGuideModal(true);
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        });
        setPermissionStatus(result.state);

        if (result.state === 'granted') {
          handleCameraPermission();
        } else if (result.state === 'denied') {
          setWebcamStatus('error');
        }

        result.addEventListener('change', (e) => {
          setPermissionStatus(result.state);
          if (result.state === 'granted') {
            handleCameraPermission();
          } else if (result.state === 'denied') {
            setWebcamStatus('error');
          }
        });
      } catch (error) {
        console.error('Permission check failed:', error);
        // If permission check fails, assume error state
        setWebcamStatus('error');
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      detectWebcam({
        onWebcamEnabled: () => {
          setWebcamStatus('ready');
          dispatch(
            setSubStepStatus({
              step: 'cameraShare',
              subStep: 'cameraShare',
              status: 'completed',
              clearError: true,
            })
          );
          dispatch(
            setStepStatus({
              step: 'cameraShare',
              status: 'completed',
            })
          );
        },
        onWebcamDisabled: (error: any) => {
          console.error('Webcam error:', error);
          setWebcamStatus('error');
          dispatch(
            setSubStepError({
              step: 'cameraShare',
              subStep: 'cameraShare',
              error: 'Failed to access camera',
            })
          );
          dispatch(
            setStepStatus({
              step: 'cameraShare',
              status: 'error',
            })
          );
        },
        optional: false,
        deviceId: selectedCamera,
      });
    }
  }, [selectedCamera, dispatch]);
  console.log(webcamStatus);

  return (
    <div className='flex flex-col gap-4 items-center w-full max-w-4xl mx-auto'>
      <div className='overflow-hidden shadow-lg bg-white w-full p-6 space-y-6 rounded-2xl'>
        <div className='aspect-video bg-gray-100 rounded-lg flex items-center justify-center'>
          {permissionStatus === 'prompt' && (
            <button
              onClick={handleCameraPermission}
              className='flex flex-col items-center gap-2'
            >
              <Camera className='w-16 h-16 text-gray-400' strokeWidth={1.5} />
              <span className='text-sm text-gray-600'>
                Click to enable camera
              </span>
            </button>
          )}
          {webcamStatus === 'error' && (
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
              webcamStatus === 'ready' ? 'block' : 'hidden'
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
                <SelectItem key={camera.id} value={camera.id}>
                  {camera.label}
                </SelectItem>
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
        isError={webcamStatus === 'error'}
      />
    </div>
  );
}
