'use client';

import React from 'react';
type BackgroundProps = {
  showLogo?: boolean;
};

export default function Background({ showLogo = true }: BackgroundProps) {
  return (
    <>
      {showLogo && (
        <img
          className="z-[-1] absolute top-5 left-[25%] lg:left-5 w-1/2 max-h-24  md:w-1/2 lg:w-1/5 object-cover rounded-md shadow-xl"
          src={ '/gkh-logo.svg'}
          alt="Logo"
        />
      )}
      <img
        className="z-[-2] fixed top-0 right-0 w-full h-full object-cover"
        src={
          'https://gkh-images.s3.amazonaws.com/4cef6a67-159b-466c-9856-a024b9a39da7_360_F_210459536_XmLDEcKq2DpeNLVmheuWeu9NM9aGKnih.jpg'
        }
        alt="Background"
      />
    </>
  );
}
