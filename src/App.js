import React, { Component } from 'react';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button } from 'reactstrap';

import './App.css';

class TargetBase extends Component {
  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div
        style={{
          border: '1px dashed black',
          padding: 50,
          margin: 5,
        }}
      >
      </div>
    );
  }
}

const Target = DropTarget('field', {
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
}))(TargetBase);

class TitleCard extends Component {
  render() {
    return (
      <div className="title-card">
        <i class="oi oi-account-login"></i>
        {this.props.title}
      </div>
    );
  }
}

class FieldComponentBase extends Component {
  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(
      <div
        style={{
          margin: 5,
        }}
      >
        MyField: FOO
      </div>
    );
  }
}

const FieldComponent = DragSource('field', {
  beginDrag(props) {
    const item = { id: props.id };
    return item;
  },

  endDrag(props, monitor, component) {
    console.log('endDrag');
    console.log(props, monitor, component);
    if (!monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    // CardActions.moveCardToList(item.id, dropResult.listId);
  }
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(FieldComponentBase);

class AppArea extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            Sidebar
            <TitleCard title="Foo" />
            <div>
              <Button>Delete</Button>
            </div>
          </div>
          <div className="col-9">
            <FieldComponent />
            <FieldComponent />
            <FieldComponent />
            <Target />
          </div>
        </div>
      </div>
    );
  }
}

const App = DragDropContext(HTML5Backend)(AppArea);

export default App;
