import React from 'react';
import Markdown from 'react-markdown';

import commonMd from '@/assets/content/screen-share-guides/common.md';

export default function ScreenShareGuide() {
  return (
    <div className="prose prose-sm max-w-none markdown-content">
      <Markdown>{commonMd}</Markdown>
    </div>
  );
};