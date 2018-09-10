
import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import styled from 'react-emotion';

class TargetBase extends Component {
  render() {
    const { connectDropTarget } = this.props;
    const iconStyling = {
      width: 30,
      height: 30,
      color: this.props.isDragging ? 'black' : '#ccc',
      opacity: this.props.isDragging ? 1 : 0
    };

    return connectDropTarget(
      <div
        style={Object.assign(
          this.props.style || {}, {
            margin: this.props.active ? 0 : 2,
            border: `${this.props.active ? '3px' : '1px'} dashed ${this.props.isDragging ? 'black' : '#ccc'}`,
            textAlign: 'center',
            borderRadius: 5,
          }
        )}
        className={this.props.className}
      >
        <i
          className={`oi oi-target`}
          style={iconStyling}
        />
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
