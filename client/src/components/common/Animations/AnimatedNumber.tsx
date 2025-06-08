import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <span ref={ref}>
      {inView && (
        <CountUp
          start={0}
          end={value}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator=","
        />
      )}
    </span>
  );
};