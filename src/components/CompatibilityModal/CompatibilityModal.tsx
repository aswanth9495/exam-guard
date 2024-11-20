'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/reduxhooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Monitor, Camera, Smartphone, Settings } from 'lucide-react';
import { RootState } from '@/global/types';

export default function Component() {
  const [isChecked, setIsChecked] = useState(false);
  const user = useAppSelector((state) => state.user);

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-[80%] h-[80%] grid grid-cols-1 md:grid-cols-2 overflow-hidden'>
        {/* Left Side */}
        <div className='bg-slate-50 p-8'>
          <div className='font-bold text-xl'>SCALER</div>

          <div className='mt-8'>
            <p className='text-gray-600'>Hi {user?.name}!</p>
            <h1 className='text-2xl font-bold mt-2'>
              {'<Assessment Test Title comes here>'}
            </h1>
          </div>

          <div className='mt-12 space-y-8'>
            {[
              {
                icon: Monitor,
                title: 'Screen Share Permissions',
                step: '1',
                active: true,
              },
              {
                icon: Camera,
                title: 'Desktop Camera Permissions',
                step: '2',
                active: false,
              },
              {
                icon: Smartphone,
                title: 'Mobile Camera Pairing',
                step: '3',
                active: false,
              },
              {
                icon: Settings,
                title: 'System Compatibility Checks',
                step: '4',
                active: false,
              },
            ].map((item, index) => (
              <div key={index} className='flex items-start gap-4'>
                <div
                  className={`rounded-full p-2 ${item.active ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  <item.icon className='w-5 h-5' />
                </div>
                <div>
                  <div className='text-sm text-gray-500'>STEP {item.step}</div>
                  <div
                    className={`font-medium ${item.active ? 'text-blue-500' : 'text-gray-700'}`}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className='p-8'>
          <div className='text-sm text-gray-500'>STEP 1</div>
          <h2 className='text-2xl font-bold mt-2'>
            Test your Screen Share Permissions
          </h2>
          <p className='text-gray-600 mt-2'>
            Test if screen share permissions are enabled. If not, follow the
            instructions below to enable them
          </p>

          <div className='mt-8 bg-slate-900 text-white p-6 rounded-lg'>
            <div className='flex items-center gap-3'>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
              <span>Screen Sharing Permissions</span>
            </div>
          </div>

          <div className='mt-8'>
            <h3 className='text-lg font-semibold'>
              Check your Screen Share Permissions
            </h3>
            <p className='text-gray-600 mt-1'>
              Screen Sharing is essential to make sure the assessment is
              happening in the fair manner
            </p>

            <Button className='mt-4' size='lg'>
              Share Entire Screen
            </Button>

            <div className='mt-4 text-sm'>
              Need help? screen sharing setup guide
            </div>

            <p className='text-gray-600 mt-8 text-sm italic'>
              Please Note : You will need to set up screen sharing again when
              your test begins, as the environment will refresh.
            </p>

            <div className='flex items-start gap-2 mt-6'>
              <Checkbox
                id='confirm'
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              />
              <label htmlFor='confirm' className='text-sm text-gray-600'>
                By clicking on this, you confirm that you have shared your
                entire screen and will be shared throughout the test.
              </label>
            </div>

            <Button
              className='mt-8 w-full'
              variant='secondary'
              disabled={!isChecked}
            >
              Proceed to next step
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
