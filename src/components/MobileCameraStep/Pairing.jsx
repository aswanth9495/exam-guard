import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';

import { Copy } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useGetQrCodeQuery } from '@/services/mobilePairingService';
import Loader from '@/ui/Loader';
import useProctorPolling from '@/hooks/useProctorPolling';
import { nextSubStep } from '@/store/features/workflowSlice';

import styles from './MobileCameraStep.module.scss';

function Pairing({ className }) {
  const dispatch = useDispatch();
  const [copySuccess, setCopySuccess] = useState(false);
  const copyLinkBoxRef = useRef(null);
  const {
    data,
    isFetching: isQrCodeLoading,
    isError: qrCodeError,
  } = useGetQrCodeQuery({ testId: 16884 });

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
          {isQrCodeLoading ? <Loader size='md' />
            : <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data.qrcode)}`} alt="qr-code"></img>}
          {
            qrCodeError && (<div> Failed to fetch QR Code </div>)
          }
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
      <div className={styles.demo}>
        <img src="https://placehold.jp/560x177.png" alt="gif"></img>
      </div>
    </div>
  );
}

export default Pairing;
