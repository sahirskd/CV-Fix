import { useState, useEffect, useRef } from 'react';

export function useLayoutResize() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [leftWidth, setLeftWidth] = useState<number>(33); // 33% initial
  const [rightWidth, setRightWidth] = useState<number>(25); // 25% initial
  const [isResizingLeft, setIsResizingLeft] = useState<boolean>(false);
  const [isResizingRight, setIsResizingRight] = useState<boolean>(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mainContainerRef.current) return;
      const rect = mainContainerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;

      if (isResizingLeft) {
        const newLeftX = e.clientX - rect.left;
        // Limit range between 15% and 50%
        const newLeftWidthPercent = Math.max(15, Math.min(50, (newLeftX / totalWidth) * 100));
        setLeftWidth(newLeftWidthPercent);
      }

      if (isResizingRight) {
        const newRightX = rect.right - e.clientX;
        // Limit range between 15% and 40%
        const newRightWidthPercent = Math.max(15, Math.min(40, (newRightX / totalWidth) * 100));
        setRightWidth(newRightWidthPercent);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft, isResizingRight]);

  return {
    isDesktop,
    leftWidth,
    rightWidth,
    isResizingLeft,
    isResizingRight,
    setIsResizingLeft,
    setIsResizingRight,
    mainContainerRef
  };
}
