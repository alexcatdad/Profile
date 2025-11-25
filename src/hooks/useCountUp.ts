import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(end: number, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled || !isInView || hasAnimated.current) return;

    hasAnimated.current = true;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (easeOutExpo)
      const easeOut = 1 - 2 ** (-10 * progress);
      const currentCount = startValue + (end - startValue) * easeOut;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, enabled, isInView]);

  return { count, ref };
}
