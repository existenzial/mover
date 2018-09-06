import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Input, Label } from 'reactstrap';

import Palette from './components/Palette';
import EditableRender from './components/EditableRender';
import StaticRender from './components/StaticRender';
import Draggable from './components/Draggable';
import SurfaceManager from './components/SurfaceManager';

import './App.css';

class Field extends Component {
  render() {
    return (
      <div
        style={{
          margin: 5,
        }}
      >
        {this.props.name}: {this.props.value}
      </div>
    );
  }
}

const FieldDraggable = Draggable(Field);

class Image extends Component {
  render() {
    return (
      <img
        className="rounded"
        style={{
          maxWidth: 500,
        }}
        src={this.props.src}
      />
    );
  }
}

const ImageDraggable = Draggable(Image);

const config = {
  widgets: [
    {
      type: 'field',
      name: 'Field',
      icon: 'list',
      editComponent: FieldDraggable,
      renderComponent: Field,
      defaultValues: {
        name: 'Foo',
        value: 'Bar'
      }
    },
    {
      type: 'image',
      name: 'Image',
      icon: 'camera-slr',
      editComponent: ImageDraggable,
      renderComponent: Image,
      defaultValues: {
        src: 'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg',
      }
    }
  ]
};

const elements = [
  [
    {
      type: 'image',
      id: 1,
      data: {
        src: 'https://images.pexels.com/photos/460823/pexels-photo-460823.jpeg',
      },
      width: 12,
    },
  ],
  [
    {
      type: 'field',
      id: 2,
      data: {
        name: 'Price',
        value: '$20.00',
      },
      width: 6,
    },
    {
      type: 'field',
      id: 3,
      data: {
        name: 'Artist',
        value: 'Matisse',
      },
      width: 6,
    },
  ],
  [
    {
      type: 'field',
      id: 4,
      data: {
        name: 'Medium',
        value: 'Black Velvet',
      },
      width: 6,
    }
  ]
];

const sm = new SurfaceManager(config, elements);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: true,
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Label check>
              <Input
                type="checkbox"
                id="checkbox2"
                checked={this.state.editable}
                onClick={() => this.setState({
                  editable: !this.state.editable,
                })}
              />
              Editable
            </Label>
          </div>
        </div>
        <div className="row">
        {
          this.state.editable ?
            [
              <div className="col-3">
                <Palette
                  manager={sm}
                />
              </div>,
              <div className="col-9">
                <EditableRender
                  manager={sm}
                />
              </div>
            ] : (
              <div>
                <StaticRender
                  manager={sm}
                />
              </div>
            )
        }
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
