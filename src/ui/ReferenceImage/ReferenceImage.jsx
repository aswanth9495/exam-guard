import React from 'react';
import classNames from 'classnames';

import successIcon from '../../assets/images/wavy-check-icon.svg';
import failedIcon from '../../assets/images/wavy-warning-icon.svg';

import styles from './ReferenceImage.module.scss';

function ReferenceImage({ className, imageSrc, failed = false, description }) {
  return (
    <div className={classNames({ [className]: className })}>
      <div className={classNames(styles.container,
        { [styles.success]: !failed },
        { [styles.failed]: failed },
      { [className]: className },
      )}>
        <img src={imageSrc} alt="reference-image" />
        {failed ? <img className={styles.icon} src={failedIcon} alt="failed" /> :
        <img className={styles.icon} src={successIcon} alt="success" />}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}

export default ReferenceImage;