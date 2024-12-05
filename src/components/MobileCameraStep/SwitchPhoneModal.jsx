import React, { useCallback } from 'react';

import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@/ui/Modal';

import switchPhone from '@/assets/images/switchPhone.svg';
import { Button } from '@/ui/Button';
import mobilePairingService, { useSendProctorEventMutation } from '@/services/mobilePairingService';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { resetStep } from '@/store/features/workflowSlice';

function SwitchPhoneModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [
    sendProctorEvent,
  ] = useSendProctorEventMutation();
  const proctor = useSelector((state) => selectProctor(state));
  const eventPayload = proctor?.compatibilityCheckConfig?.defaultPayload;
  const eventEndpoint = proctor?.compatibilityCheckConfig?.endpoint;

  /* Handlers */
  const handleSwitchPhone = useCallback(async () => {
    console.log('%c⧭', 'color: #00ff88', 'Clicked switch');
    if (eventPayload && eventEndpoint) {
      try {
        const response = await sendProctorEvent({
          payload: eventPayload,
          endpoint: eventEndpoint,
          eventType: 'secondary_camera',
          eventName: 'setup_reset',
        });

        console.log('%c⧭', 'color: #00258c', response);
        if (response.data.success) {
          console.log('%c⧭', 'color: #994d75', 'resetStep');
          dispatch(resetStep({
            step: 'mobileCameraShare',
          }));
          dispatch(mobilePairingService.util.resetApiState());
          onClose?.();
        }
      } catch (e) {
        // error handling
      }
    }
  }, [dispatch, eventEndpoint, eventPayload, onClose, sendProctorEvent]);

  return (
    <Modal
      containerClassName='rounded-2xl'
      isOpen={isOpen}
      modalClassName='p-12 flex flex-col justify-center text-center items-center max-w-[600px] relative'>
      <img src={switchPhone} alt="switch-phone" className="h-[7.2rem] w-[7.2rem] pb-4" />
      <heading className="text-2xl mb-1">You are going to Scan QR Code again</heading>
      <article className="text-gray-500 text-sm">
      Confirming this will disconnect your current mobile phone.
      You&apos;ll need to scan the QR code again to reconnect your mobile
      with the desktop.
      </article>

      <section className="mt-8">
        <Button
          type="button"
          className="items-center py-8 px-10"
          variant='primary'
          onClick={handleSwitchPhone}
        >
          Scan QR Code again
        </Button>
        <Button
          type="button"
          className="items-center py-8 px-10 ml-2"
          onClick={onClose}
          variant="outline"
        >
          Cancel
        </Button>
      </section>
      <button
        className="absolute top-5 right-5 text-gray-500 hover:text-gray-800"
        onClick={onClose}
        aria-label="Close">
        <X />
      </button>
    </Modal>
  );
}

export default SwitchPhoneModal;
