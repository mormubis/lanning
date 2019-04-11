import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animation, Area as Shape } from 'calvin-svg';

class Area extends Component {
  static defaultProps = {
    duration: 3000,
    ease: 'cubic-out',
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    curve: PropTypes.string,
    delay: PropTypes.number,
    duration: PropTypes.number,
    ease: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  prevPoints = this.props.points.fill(0);

  componentDidUpdate(prevProps) {
    this.prevPoints = prevProps.points;
  }

  render() {
    const { prevPoints } = this;
    const {
      children,
      curve,
      delay,
      duration,
      ease,
      points,
      ...props
    } = this.props;

    return (
      <Shape curve={curve} points={points} {...props}>
        <Animation
          attribute="d"
          delay={delay}
          duration={duration}
          ease={ease}
          step={percentage =>
            Shape.d({
              curve,
              points: points.map(
                (value, index) =>
                  prevPoints[index] + (value - prevPoints[index]) * percentage,
              ),
            })
          }
        />
        {children}
      </Shape>
    );
  }
}

export default Area;
