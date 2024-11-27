/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { CircleCheck } from 'lucide-react';
import styles from './Tabs.module.scss';

const Tab = ({
  name, label, isActive, onClick, isDisabled, isCompleted,
}) => {
  const tabClass = isActive
    ? styles.active
    : styles.inactive;

  return (
    <div
      name={name}
      className={`${styles.tab} ${tabClass}`}
      onClick={!isDisabled ? onClick : null}
    >
      {isCompleted && <CircleCheck className="mr-2" />}
      {label}
    </div>
  );
};

Tab.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
};

Tab.defaultProps = {
  isActive: false,
  isDisabled: false,
};

export default Tab;
