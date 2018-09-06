import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { elementType, managerType } from './types';

const createTypeMap = ( { widgets } ) => {
  const map = {};
  widgets.forEach( widget => map[ widget.type ] = widget );
  return map;
};

class StaticElement extends Component {
  render() {
    const { element } = this.props;
    const Comp = this.props.typeMap[element.type].renderComponent;
    return (
      <div
        className={`col-${element.width} rounded`}
      >
        <Comp
          {...element.data}
        />
      </div>
    );
  }
};

StaticElement.propTypes = {
  element: elementType,
  typeMap: PropTypes.object,
  onEndDrag: PropTypes.func.isRequired,
  last: PropTypes.bool,
};

class StaticRenderer extends Component {
  render() {
    const { manager } = this.props;
    const typeMap = createTypeMap(manager.config);
    return (
      <div>
        {manager.elements.map((row, index) => (
          <div className="row" key={`row-${index}`}>
            {
              row.map(element => (
                <StaticElement
                  element={element}
                  typeMap={typeMap}
                  key={element.id}
                  manager={manager}
                />
              ))
            }
          </div>
        ))}
      </div>
    );
  }
};

StaticRenderer.propTypes = {
  manager: managerType.isRequired,
};

export default observer(StaticRenderer);
