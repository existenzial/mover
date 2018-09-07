
import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import styled from 'react-emotion';

const TargetIndicator = styled('div')`
  margin: ${props => props.active ? '2px' : '4px'};
  border: ${props => props.active ? '3px' : '1px'} dashed ${props => props.isDragging ? 'black' : '#ccc'};
  width: ${props => props.vertical ? '25px' : 'auto'};
  height: ${props => props.vertical ? '90%' : '25px'};
  padding: ${props => props.vertical ? '5px' : '0px'};
  border-radius: 5px;
  text-align: center;
`;

class TargetBase extends Component {
  render() {
    const { connectDropTarget } = this.props;
    const iconStyling = {
      width: 30,
      height: 30,
      color: this.props.isDragging ? 'black' : '#ccc'
    };
    if (this.props.vertical) {
      iconStyling.position = 'relative';
      iconStyling.top = '25%';
    }

    return connectDropTarget(
      <div
        style={this.props.style}
        className={this.props.className}
      >
        <TargetIndicator
          active={this.props.active}
          vertical={this.props.vertical}
          isDragging={this.props.isDragging}
        >
          <i
            className={`oi oi-target`}
            style={iconStyling}
          />
        </TargetIndicator>
      </div>
    );
  }
}

const Target = DropTarget('field', {
  drop(props, monitor, component) {
    props.onDrop(monitor.getItem(), props);
  },
  hover(props, monitor, component) {
    if(monitor.isOver()) {
      props.onActivate(props.id);
    }
  }
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
}))(TargetBase);

export default Target;
