import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'react-emotion';

import Target from './Target';

import { elementType, managerType } from './types';

const createTypeMap = ( { widgets } ) => {
  const map = {};
  widgets.forEach( widget => map[ widget.type ] = widget );
  return map;
};

const EditableElementContainer = styled('div')`
  padding: 0px;
  background: #efefef;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleBar = styled('div')`
  background: #666;
  color: white;
  border-radius: 15px 15px 0px 0px;
  background: #ccc;

  display: flex;
  flex-direction: row;
`;

const TitleBarTitle = styled('div')`
  flex-grow: 1;
  text-align: center;
`;

const ElementContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 0px;
`;

const ElementInterior = styled('div')`
  flex-grow: 1;
`;

class EditableElementBase extends Component {
  render() {
    const { element, manager, last } = this.props;
    const Comp = this.props.typeMap[element.type].editComponent;
    return (
      <div
        className={`col-${element.width} rounded`}
        style={{
          padding: 2,
        }}
      >
        <EditableElementContainer>
          <TitleBar>
            <div>
              <button
                className="btn btn-link"
                onClick={() => this.props.onDelete(element.id)}
                style={{
                  height: 35,
                }}
              >
                <i
                  className={`oi oi-circle-x`}
                  style={{
                    width: 30,
                    height: 30,
                    color: 'white',
                  }}
                />
              </button>
            </div>
            <TitleBarTitle>
              {this.props.typeMap[element.type].name}
            </TitleBarTitle>
            <div>
              <button
                className="btn btn-link"
                onClick={() => this.props.toggleEditMode(element.id)}
                style={{
                  height: 35,
                }}
              >
                <i
                  className={`oi oi-cog`}
                  style={{
                    width: 30,
                    height: 30,
                    color: 'white',
                  }}
                />
              </button>
            </div>
          </TitleBar>
          <ElementContainer>
            <Target
              beforeElement={element.id}
              id={`before-${element.id}`}
              key={`before-row-${element.id}`}
              active={manager.activeTarget === `before-${element.id}`}
              isDragging={manager.isDragging}
              onActivate={(id) => manager.activeTarget = id}
              onDrop={(source, target) => manager.onDrop(source, target)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '2px 5px 2px 5px',
                textAlign: 'center',
              }}
            />
            <ElementInterior>
              <Comp
                onEndDrag={this.props.onEndDrag}
                onBeginDrag={this.props.onBeginDrag}
                manager={this.props.manager}
                element={element}
                id={element.id}
                editMode={this.props.editMode}
                {...element.data}
              />
            </ElementInterior>
            {last && 
            (
              <Target
                afterElement={element.id}
                id={`after-${element.id}`}
                key={`after-${element.id}`}
                active={manager.activeTarget === `after-${element.id}`}
                isDragging={manager.isDragging}
                onActivate={(id) => manager.activeTarget = id}
                onDrop={(source, target) => manager.onDrop(source, target)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '2px 5px 2px 5px',                
                }}
              />
            )}
          </ElementContainer>
        </EditableElementContainer>
      </div>
    );
  }
};

EditableElementBase.propTypes = {
  manager: managerType,
  element: elementType,
  typeMap: PropTypes.object,
  onEndDrag: PropTypes.func.isRequired,
  onBeginDrag: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  last: PropTypes.bool,
  editMode: PropTypes.bool,
};

const EditableElement = observer(EditableElementBase);

class EditableRender extends Component {
  render() {
    const { manager } = this.props;
    const typeMap = createTypeMap(manager.config);
    return (
      <div>
        {manager.elements.map((row, index) => [
          <div className="row" key={`before-row-${index}`}>
            <div className="col-12">
              <Target
                beforeRow={index}
                id={`before-row-${index}`}
                key={`before-row-${index}`}
                active={manager.activeTarget === `before-row-${index}`}
                isDragging={manager.isDragging}
                onActivate={(id) => manager.activeTarget = id}
                onDrop={(source, target) => manager.onDrop(source, target)}
              />
            </div>
          </div>,
          <div className="row" key={`row-${index}`}>
            {
              row.map((element, elementIndex) => (
                <EditableElement
                  element={element}
                  typeMap={typeMap}
                  key={element.id}
                  manager={manager}
                  editMode={Boolean(manager.editMode[element.id])}
                  toggleEditMode={(id) => manager.toggleEditMode(id)}
                  onDelete={(id) => manager.onDelete(id)}
                  onEndDrag={() => manager.onEndDrag()}
                  onBeginDrag={() => manager.onBeginDrag()}
                  last={elementIndex === row.length - 1}
                />
              ))
            }
          </div>
      ])}
        <Target
          id="after"
          active={manager.activeTarget === 'after'}
          isDragging={manager.isDragging}
          onActivate={(id) => manager.activeTarget = id}
          onDrop={(source, target) => manager.onDrop(source, target)}
        />
    </div>
    );
  }
};

EditableRender.propTypes = {
  manager: managerType.isRequired,
};

export default observer(EditableRender);
