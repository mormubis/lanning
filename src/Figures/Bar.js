import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animation, Rect } from 'calvin-svg';

class Bar extends Component {
  static defaultProps = {
    duration: 500,
    ease: 'cubic-out',
    height: 0,
    radius: 4,
    width: 8,
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    delay: PropTypes.number,
    duration: PropTypes.number,
    ease: PropTypes.string,
    height: PropTypes.number,
    radius: PropTypes.number,
    width: PropTypes.number,
  };

  render() {
    const { prevHeight } = this;
    const {
      children,
      delay,
      duration,
      ease,
      height,
      width,
      ...props
    } = this.props;

    return (
      <Rect width={width} {...props}>
        <Animation
          attribute="height"
          delay={delay}
          duration={duration}
          ease={ease}
          fill="freeze"
          from={prevHeight}
          to={height}
        />
        {children}
      </Rect>
    );
  }
}

export default Bar;
