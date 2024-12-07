import React from 'react';
import Markdown from 'react-markdown';

import chromeMd from '@/assets/content/screen-share-guides/chrome.md';
import edgeMd from '@/assets/content/screen-share-guides/edge.md';
import firefoxMd from '@/assets/content/screen-share-guides/firefox.md';
import safariMd from '@/assets/content/screen-share-guides/safari.md';

interface ScreenShareGuideProps {
  browserName: string;
}

const BROWSER_GUIDES = {
  chrome: chromeMd,
  firefox: firefoxMd,
  edge: edgeMd,
  safari: safariMd,
} as const;

export default function ScreenShareGuide({
  browserName,
}: ScreenShareGuideProps) {
  const guide = BROWSER_GUIDES[browserName.toLowerCase() as keyof typeof BROWSER_GUIDES];

  return (
    <div className="prose prose-sm max-w-none markdown-content">
      <Markdown>{guide}</Markdown>
    </div>
  );
};