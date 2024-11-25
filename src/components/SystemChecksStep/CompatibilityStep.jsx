import React from 'react';
import classNames from 'classnames';

import { COMPATIBILITY_CHECK_STATUSES } from '@/utils/constants';
import warningIcon from '@/assets/images/red-warning.svg'
import checkIcon from '@/assets/images/check-circle.svg'

import styles from './SystemChecksStep.module.scss';

function CompatibilityStep({ 
  title, description, error, extraUi,
  status = COMPATIBILITY_CHECK_STATUSES.default,
  className }) {
  
    const iconUi = () => {
      switch (status) {
        case 'failed':
          return (<img className="w-14 h-14 mr-6" src={warningIcon} alt="red-warning"/>)
          break;
        case 'success':
          return (<img className="w-14 h-14 mr-6" src={checkIcon} alt="success"/>)
          break;
        default:
          return (<span className={styles.outlineCircle} alt="default-icon"></span>)
          break;
      }
    }

    const checkUi = () => {
      return (
        <section className="flex flex-row items-center justify-between w-full"> 
          <section className="flex flex-col">
            <heading className={classNames(
              'text-lg', 
              {'font-bold': status === 'failed'},
            )}>{title}</heading>
            {status === 'failed' && (<article className={styles.checkDescription}>
              {description}
            </article>)}
            {status === 'failed' && error && (
              <article className="text-red-600 mt-5"> 
                {error}
              </article>
            )}
          </section>
          {extraUi && status === 'failed' &&(<section className="flex items-center">
            {extraUi}
          </section>)}
        </section>
      )
    }
  
  return (
    <div className={classNames(
      'flex flex-row py-10 px-16',
      { 'items-start bg-red-100': status === 'failed' },
      { 'items-center': status !== 'failed'},
      { [className]: className }
    )}>
        {iconUi()}
        {checkUi()}
    </div>
  );
}

export default CompatibilityStep;