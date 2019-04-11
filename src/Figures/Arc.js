import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animation, Arc as Shape } from 'calvin-svg';

class Arc extends Component {
  static defaultProps = {
    duration: 500,
    ease: 'cubic-out',
    thickness: 15,
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    delay: PropTypes.number,
    duration: PropTypes.number,
    endAngle: PropTypes.number.isRequired,
    ease: PropTypes.string,
    height: PropTypes.number,
    startAngle: PropTypes.number.isRequired,
    thickness: PropTypes.number,
    width: PropTypes.number,
  };

  prevEndAngle = this.props.startAngle;

  prevStartAngle = this.props.startAngle;

  componentDidUpdate(prevProps) {
    this.prevEndAngle = prevProps.endAngle;
    this.prevStartAngle = prevProps.startAngle;
  }

  render() {
    const { prevEndAngle, prevStartAngle } = this;
    const {
      children,
      delay,
      duration,
      ease,
      endAngle,
      height,
      startAngle,
      thickness,
      width,
      ...props
    } = this.props;

    return (
      <Shape
        endAngle={endAngle}
        height={height}
        startAngle={startAngle}
        thickness={thickness}
        width={width}
        {...props}
      >
        <Animation
          attribute="d"
          delay={delay}
          duration={duration}
          ease={ease}
          step={percentage =>
            Arc.d({
              endAngle: prevEndAngle + (prevEndAngle - endAngle) * percentage,
              thickness,
              height,
              startAngle:
                prevStartAngle + (prevStartAngle - startAngle) * percentage,
              width,
            })
          }
        />
        {children}
      </Shape>
    );
  }
}

export default Arc;
