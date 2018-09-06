import PropTypes from 'prop-types';

export const widgetType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  editComponent: PropTypes.func.isRequired,
  renderComponent: PropTypes.func.isRequired,
});

export const elementType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
});

export const elementsType = PropTypes.arrayOf(PropTypes.arrayOf(elementType));

export const configType = PropTypes.shape({
  widgets: PropTypes.arrayOf(widgetType),
});

export const managerType = PropTypes.shape({
  config: configType,
  elements: elementsType,
  activeTarget: PropTypes.string.isRequired,
});