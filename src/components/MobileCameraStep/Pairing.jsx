import React, { useRef, useState } from 'react';
import classNames from 'classnames';

import qrCodeImg from '../../assets/images/dummy/qr-code.svg'
import { Copy } from 'lucide-react';

import styles from './MobileCameraStep.module.scss';

function Pairing({ className }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const copyLinkBoxRef = useRef(null); 

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
          setCopySuccess(false);  // Handle failure (optional)
        }
      );
    }
  };

  return (
    <div className={classNames({ [className]: className })}>
      <div className={styles.pairingContainer}>
        <section className={styles.qrCodeContainer}>
          {/* QR Code */}
          <img src={qrCodeImg}  alt="gif"></img>
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
            <div className={styles.copyLinkBox} ref={copyLinkBoxRef}> Dummy link goes here </div>
            <span className={styles.copyLinkText} onClick={handleCopyClick}> 
              <Copy className={styles.copyIcon} />
              {copySuccess ? (
                <div className={styles.copySuccessMessage}>Copied!</div> // Optionally show a success message
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