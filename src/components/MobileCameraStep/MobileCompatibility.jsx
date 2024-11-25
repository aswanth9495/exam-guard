import React from 'react';
import classNames from 'classnames';

import styles from './MobileCameraStep.module.scss';
import { COMPATIBILITY_CHECK_STATUSES } from '@/utils/constants';

import warningIcon from '@/assets/images/red-warning.svg'

const COMPATIBILITY_CHECK_DATA = {
  battery: {
    default: {
      title: 'Battery Check in progress...',
      description: `Checking your battery level to ensure the session isn't interrupted`,
    },
    success: {
      title: 'Battery Check successfully done',
      description: `Checking your battery level to ensure the session isn't interrupted`,
    },
    failed: {
      title: 'Battery Check',
      description: `Checking your battery level to ensure the session isn't interrupted`,
    }, 
    alert: 'Your battery is very low. Less than 10%. Please charge your phone to avoid any interruption'
  }
}

const DEFAULT_STATUS_MAP = {
  battery: 'failed'
}

/* Creating separate UI as the designs can be different in the future */
const successUi = ({ title, description }) => {
  return (
    <section className="flex flex-col">
      <heading className={styles.compatibilityTitle}>{title}</heading>
      <p className={styles.compatibilityBody}>{description}</p>
    </section>
  )
}

const defaultUi = ({ title, description }) => {
  return (
    <section className="flex flex-col">
      <heading className={styles.compatibilityTitle}>{title}</heading>
      <p className={styles.compatibilityBody}>{description}</p>
    </section>
  )
}

const failedUi = ({ title, description }) => {
  return (
    <section className="flex flex-row items-start">
      <img className={styles.compatibilityWarningIcon} src={warningIcon} alt="red-warning"/>
      <section className="flex flex-col ml-6">
        <heading className={styles.compatibilityTitle}>{title}</heading>
        <p className={styles.compatibilityBody}>{description}</p>
      </section>
    </section>
  )
}

function MobileCompatibility({ 
  className, 
  statusMap=DEFAULT_STATUS_MAP 
}) {
  return (
    <div className={classNames('flex flex-col justify-between', { [className]: className })}> 
      <section>
      {Object.keys(statusMap).map((check) => {
        const checkStatus = statusMap[check]
        const checkData = COMPATIBILITY_CHECK_DATA?.[check]?.[checkStatus]
        if (checkData){
          switch (checkStatus) {
            case COMPATIBILITY_CHECK_STATUSES.success:
              return successUi({ ...checkData  })
            case COMPATIBILITY_CHECK_STATUSES.failed:
              return failedUi({ ...checkData  })
            default:
              return defaultUi({ ...checkData  })
          }
        }
        
      })}
      </section>
      <section className={styles.compatibilityAlert}>
        <b>Your battery is very low. </b>
        <i>Less than 10%. Please charge your phone to avoid any interruption.</i>
      </section>
    </div>
  );
}

export default MobileCompatibility;