import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

export default (Comp) => {
  class ComponentEditable extends Component {
    render() {
      const { connectDragSource } = this.props;
  
      return connectDragSource(
        <div>
          <Comp {...this.props} />
        </div>
      );
    }
  }
  
  return DragSource('field', {
    beginDrag(props) {
      props.onBeginDrag();
      const item = { id: props.id };
      return item;
    },
  
    endDrag(props, monitor, component) {
      props.onEndDrag();
      if (!monitor.didDrop()) {
        return;
      }
    }
  }, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(ComponentEditable);
};
