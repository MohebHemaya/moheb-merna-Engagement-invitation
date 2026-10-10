import { useState, useEffect } from 'react';

/**
 * useLiteMode hook
 * Detects weak devices, slow connections, or save-data preferences
 */
export function useLiteMode() {
  const [isLite, setIsLite] = useState(false);

  useEffect(() => {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const saveData = conn?.saveData === true;
    const slowNet = conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType);
    const lowMem = nav.deviceMemory && nav.deviceMemory <= 2;
    const lowCpu = nav.hardwareConcurrency && nav.hardwareConcurrency <= 4;

    setIsLite(Boolean(saveData || slowNet || lowMem || lowCpu));
  }, []);

  return isLite;
}
