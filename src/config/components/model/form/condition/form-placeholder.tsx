import { Skeleton } from '@mui/material';
import React, { FC } from 'react';

const Component: FC = () => (
  <div className='grid gap-2'>
    <div className='flex gap-2'>
      {new Array(2).fill('').map((_, i) => (
        <div key={i} className='flex gap-2 items-center'>
          <Skeleton variant='circular' width={20} />
          <Skeleton width={200} height={30} />
        </div>
      ))}
    </div>
    <div className='grid gap-4'>
      <Skeleton variant='text' width={220} />
      {new Array(3).fill('').map((_, i) => (
        <div key={i} className='flex gap-2 items-center'>
          <Skeleton variant='rounded' width={400} height={52} />
          <Skeleton variant='circular' width={20} />
          <Skeleton variant='circular' width={20} />
        </div>
      ))}
    </div>
  </div>
);

export const FormPlaceholder = Component;
