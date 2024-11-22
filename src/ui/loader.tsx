import { useEffect } from 'react';

export default function CircularLoader() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className='flex items-center justify-center bg-[#000B18]'>
      <div className='relative h-8 w-8'>
        <div className='absolute inset-0 rounded-full border-4 border-[##0080FF] opacity-25'></div>
        <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-[#0080FF] animate-[spin_1s_linear_infinite]'></div>
      </div>
    </div>
  );
}
