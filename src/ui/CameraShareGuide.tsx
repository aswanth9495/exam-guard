import React from 'react';
import Markdown from 'react-markdown';

import chromeMd from '@/assets/content/camera-share-guides/chrome.md';
import edgeMd from '@/assets/content/camera-share-guides/edge.md';
import firefoxMd from '@/assets/content/camera-share-guides/firefox.md';
import safariMd from '@/assets/content/camera-share-guides/safari.md';

interface CameraShareGuideProps {
  browserName: string;
}

const BROWSER_GUIDES = {
  chrome: chromeMd,
  firefox: firefoxMd,
  edge: edgeMd,
  safari: safariMd,
} as const;

export default function CameraShareGuide({
  browserName,
}: CameraShareGuideProps) {
  const guide = BROWSER_GUIDES[browserName.toLowerCase() as keyof typeof BROWSER_GUIDES];

  return (
    <div className="prose prose-sm max-w-none markdown-content">
      <Markdown>{guide}</Markdown>
    </div>
  );
};