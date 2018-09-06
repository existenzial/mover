import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import styled from 'react-emotion';
import { observer } from 'mobx-react';

import { widgetType, managerType } from './types';

const Pill = styled('div')`
  border-radius: 5px;
  background: #ccc;
  margin-bottom: 5px;
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

class PaletteWidgetBase extends Component {
  render() {
    return this.props.connectDragSource(
      <div>
        <Pill>
          <i
            className={`oi oi-${this.props.widget.icon}`}
            style={{
              paddingRight: 5,
            }}
          />
          {this.props.widget.name}
        </Pill>
      </div>
    );
  }
}

PaletteWidgetBase.propTypes = {
  widget: widgetType.isRequired,
};

const PaletteWidget = DragSource('field', {
  beginDrag( { manager, id, widget } ) {
    manager.onBeginDrag();
    const item = {
      id,
      widget,
      source: 'palette',
    };
    return item;
  },

  endDrag(props, monitor, component) {
    props.manager.onEndDrag();
  }
}, (connect) => ({
  connectDragSource: connect.dragSource(),
}))(PaletteWidgetBase);

class Palette extends Component {
  render() {
    return (
      <div>
        {this.props.manager.config.widgets.map( widget =>
          <PaletteWidget
            widget={widget}
            key={widget.name}
            manager={this.props.manager}
          />
        )}
      </div>
    );
  }
}

Palette.propTypes = {
  manager: managerType,
};

export default observer(Palette);
