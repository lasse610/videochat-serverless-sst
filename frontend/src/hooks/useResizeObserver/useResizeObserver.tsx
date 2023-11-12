import { useRef, useState, useCallback } from 'react';

export default function useResizeObserver() {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const resizeObserver = useRef<ResizeObserver>(
    new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const dimensions = entries[0].contentRect;
      if (dimensions.height !== 0 && dimensions.width !== 0) {
        setContainerHeight(dimensions.height);
        setContainerWidth(dimensions.width);
      }
    })
  );

  const resizeObserverRef = useCallback((container: HTMLDivElement) => {
    if (container !== null) {
      resizeObserver.current.observe(container);
    } else {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    }
  }, []);

  return { containerWidth, containerHeight, resizeObserverRef };
}
