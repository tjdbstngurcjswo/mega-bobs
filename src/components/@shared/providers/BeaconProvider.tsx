'use client';

import { useEffect } from 'react';

import initBeacon from '@/lib/beacon/initBeacon';

const BeaconProvider = () => {
  useEffect(() => {
    initBeacon();
  }, []);

  return null;
};

export default BeaconProvider;
