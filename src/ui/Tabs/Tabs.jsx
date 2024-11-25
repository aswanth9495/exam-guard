import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Tabs.module.scss';
import Tab from './Tab';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {React.Children.map(children, (child, index) => 
          React.cloneElement(child, {
            isActive: activeTab === index,
            onClick: () => handleTabClick(index),
          })
        )}
      </div>
      <div className={styles.tabContent}>
        {React.Children.toArray(children)[activeTab]?.props.children}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Tabs;
