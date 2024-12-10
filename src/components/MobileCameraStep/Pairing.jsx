import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';

import { Copy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetQrCodeQuery } from '@/services/mobilePairingService';
import Loader from '@/ui/Loader';
import useProctorPolling from '@/hooks/useProctorPolling';
import { nextSubStep } from '@/store/features/workflowSlice';
import { selectProctor } from '@/store/features/assessmentInfoSlice';

import styles from './MobileCameraStep.module.scss';

function Pairing({ className }) {
  const dispatch = useDispatch();
  const [copySuccess, setCopySuccess] = useState(false);
  const copyLinkBoxRef = useRef(null);
  const proctor = useSelector((state) => selectProctor(state));
  const qrCodePayload = proctor?.qrCodeConfig?.defaultPayload || {};
  const qrCodeEndpoint = proctor?.qrCodeConfig?.endpoint;

  const {
    data,
    isFetching: isQrCodeLoading,
    isError: qrCodeError,
  } = useGetQrCodeQuery({
    endpoint: qrCodeEndpoint,
    payload: qrCodePayload,
  });

  const handleSetupSuccess = useCallback(() => {
    dispatch(nextSubStep());
  }, [dispatch]);

  const handleSetupFailure = useCallback(() => {
    // Do nothing
  }, []);

  useProctorPolling({
    onSetupSuccess: handleSetupSuccess,
    onSetupFailure: handleSetupFailure,
  });

  const handleCopyClick = () => {
    const linkToCopy = copyLinkBoxRef.current ? copyLinkBoxRef.current.textContent : '';

    if (linkToCopy) {
      navigator.clipboard.writeText(linkToCopy).then(
        () => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        },
        (err) => {
          console.error('Error copying text: ', err);
          setCopySuccess(false); // Handle failure (optional)
        },
      );
    }
  };

  return (
    <div className={classNames({ [className]: className })}>
      <div className={styles.pairingContainer}>
        <section className={styles.qrCodeContainer}>
          {/* QR Code */}
          {isQrCodeLoading || qrCodeError || !data?.qrcode ? <Loader size='md' />
            : <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data?.qrcode)}`} alt="qr-code"></img>}
        </section>
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <div className={styles.dividerText}> OR </div>
          <div className={styles.dividerLine}></div>
        </div>
        <section className={styles.copyLinkContainer}>
          <header className={styles.copyLinkHeading}>
            Pair mobile via link
          </header>
          <article className={styles.copyLinkBody}>
            Copy link to open on your mobile. It might take few sec to load
          </article>
          <section className={styles.copyLinkOption}>
            <div className={styles.copyLinkBox} ref={copyLinkBoxRef}>{data?.link}</div>
            <span className={styles.copyLinkText} onClick={handleCopyClick}>
              <Copy className={styles.copyIcon} />
              {copySuccess ? (
                <div className={styles.copySuccessMessage}>
                  Copied!
                </div>
              ) : 'Copy'}
            </span>
          </section>
        </section>
      </div>
      <section className="mt-10">
          <article className={styles.orientationInstructions}>
            <heading className={styles.orientationInstructionHeading}>
              Instructions :
            </heading>
            <ul className={styles.orientationInstructionPoints}>
              <li>Scan the QR code using your Android/iOS device
               or use the link to open it on your mobile phone.</li>
              <li>
                Tap the link to open it in your default
                browser and follow the instructions to grant camera access
              </li>
              <li>
                Place your mobile device on a stable surface.
              </li>
              <li>
                Choose landscape or portrait orientation, ensuring your desktop,
                 hands, and workspace are clearly visible with proper lighting.
              </li>
            </ul>
          </article>
        </section>
    </div>
  );
}

export default Pairing;
