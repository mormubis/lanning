import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Animation, Line as Shape } from 'calvin-svg';

export class Line extends Component {
  static defaultProps = {
    duration: 3000,
    ease: 'cubic-out',
    opacity: 1,
    thickness: 3,
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
    opacity: PropTypes.number,
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    thickness: PropTypes.number,
  };

  element = createRef();

  prevPoints = this.props.points;

  state = { length: 0 };

  componentDidMount() {
    const length = this.element.current.length();

    this.setState({ length });
  }

  render() {
    const { prevPoints } = this;
    const {
      children,
      curve,
      delay,
      duration,
      ease,
      opacity,
      points,
      ...props
    } = this.props;
    const { length } = this.state;

    return (
      <Shape
        ref={this.element}
        strokeDasharray={length}
        points={points}
        {...props}
        opacity={length === 0 ? 0 : opacity}
      >
        <Animation
          attribute="stroke-dashoffset"
          duration={duration}
          ease={ease}
          from={length}
          strokeLinecap="round"
          strokeLinejoin="round"
          to={0}
        />
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

export default Line;
