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
`;

const TitleBar = styled('div')`
  background: #666;
  color: white;
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 15px 15px 0px 0px;
`;

const ElementContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

class EditableElement extends Component {
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
            <a
              href='#'
              onClick={() => this.props.onDelete(element.id)}
            >
              <i
                className={`oi oi-circle-x`}
                style={{
                  width: 30,
                  height: 30,
                  color: 'white',
                  paddingRight: 10,
                }}
              />
            </a>
            {this.props.typeMap[element.type].name}
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
              vertical
              style={{
                justifyContent: 'flex-start',
              }}
            />
            <Comp
              onEndDrag={this.props.onEndDrag}
              onBeginDrag={this.props.onBeginDrag}
              id={element.id}
              {...element.data}
            />
            {last && <Target
              afterElement={element.id}
              id={`after-${element.id}`}
              key={`after-${element.id}`}
              active={manager.activeTarget === `after-${element.id}`}
              isDragging={manager.isDragging}
              onActivate={(id) => manager.activeTarget = id}
              onDrop={(source, target) => manager.onDrop(source, target)}
              vertical
              style={{
                justifyContent: 'flex-end',
              }}
            />}
          </ElementContainer>
        </EditableElementContainer>
      </div>
    );
  }
};

EditableElement.propTypes = {
  element: elementType,
  typeMap: PropTypes.object,
  onEndDrag: PropTypes.func.isRequired,
  onBeginDrag: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  last: PropTypes.bool,
};

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
