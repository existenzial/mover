import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Input, Label, FormGroup, Form } from 'reactstrap';
import { observer } from 'mobx-react';

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
        {this.props.editMode ? (
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <Form inline>
              <FormGroup row>
                <Label for={`${this.props.id}-value`}>
                  {this.props.name}
                </Label>
                <Input
                  id={`${this.props.id}-value`}
                  type="text"
                  value={this.props.element.data.value}
                  onChange={
                    ({ target: { value }}) => this.props.element.data.value = value
                  }
                />
              </FormGroup>
            </Form>
            <Form inline>
              <FormGroup row>
                <Label for={`${this.props.id}-width`}>
                  Width
                </Label>
                <Input
                  id={`${this.props.id}-width`}
                  type="select"
                  value={this.props.element.width}
                  onChange={
                    ({ target: { value }}) => this.props.element.width = value
                  }
                >
                  <option value="6">Half width</option>
                  <option value="12">Full width</option>
                </Input>
              </FormGroup>
            </Form>
          </div>
        ) : (
          `${this.props.name}: ${this.props.value}`
        )}
      </div>
    )
  }
}

const FieldDraggable = Draggable(observer(Field));

class Image extends Component {
  render() {
    return (
      <img
        className="rounded"
        style={{
          maxWidth: 500,
        }}
        alt="Probably a dog"
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
                onChange={() => this.setState({
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
              <div className="col-3" key="palette">
                <Palette
                  manager={sm}
                />
              </div>,
              <div className="col-9" key="edit-area">
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
