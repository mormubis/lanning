import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animation, Arc as Shape } from 'calvin-svg';

const Arc = ({
  children,
  delay,
  duration = 500,
  ease = 'cubic-out',
  endAngle,
  height,
  radius,
  startAngle,
  thickness = 15,
  width,
  ...props
}) => {
  const prevEndAngle = useRef(startAngle);
  const prevStartAngle = useRef(startAngle);

  useEffect(() => {
    prevEndAngle.current = endAngle;
    prevStartAngle.current = startAngle;
  }, [endAngle, startAngle]);

  return (
    <Shape
      endAngle={prevEndAngle.current}
      height={height}
      radius={radius}
      startAngle={prevStartAngle.current}
      thickness={thickness}
      width={width}
      {...props}
    >
      <Animation
        attribute="d"
        delay={delay}
        duration={duration}
        ease={ease}
        fill="freeze"
        step={percentage =>
          Shape.d({
            endAngle:
              prevEndAngle.current +
              (endAngle - prevEndAngle.current) * percentage,
            thickness,
            height,
            radius,
            startAngle:
              prevStartAngle.current +
              (startAngle - prevStartAngle.current) * percentage,
            width,
          })
        }
      />
      {children}
    </Shape>
  );
};

Arc.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  delay: PropTypes.number,
  duration: PropTypes.number,
  endAngle: PropTypes.number.isRequired,
  ease: PropTypes.string,
  height: PropTypes.number,
  radius: PropTypes.number,
  startAngle: PropTypes.number.isRequired,
  thickness: PropTypes.number,
  width: PropTypes.number,
};

export default memo(Arc);
