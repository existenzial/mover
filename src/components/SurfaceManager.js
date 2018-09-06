import { observable, decorate } from 'mobx';
import uuid from 'uuid/v1';

export default class SurfaceManager {
  constructor(config, elements) {
    this.config = config;
    this.elements = elements;
    this.activeTarget = '';
    this.isDragging = false;
  }

  onBeginDrag() {
    console.log('onBeginDrag');
    this.activeTarget = '';
    this.isDragging = true;
  }

  onEndDrag() {
    console.log('onBeginDrag');
    this.activeTarget = '';
    this.isDragging = false;
  }

  onDelete(id) {
    const {
      row,
      index
    } = this.findItem(id);
    this.elements[row].splice(index, 1);
    this.pruneElements();
  }

  onDrop(source, target) {
    this.activeTarget = '';
    if (source.source === 'palette') {
      this.insertElement(target, this.newElement(source.widget));
    } else if(source.id) {
      const {
        row,
        index
      } = this.findItem(source.id);

      const elementData = Object.assign( this.elements[row][index] );
      this.elements[row].splice(index, 1);
      this.insertElement(target, elementData);
    }

    this.pruneElements();
  }

  pruneElements() {
    const findEmptyRowIndex = () => {
      let found = null;
      this.elements.forEach((row, index) => {
        if (row.length === 0) {
          found = index;
        }
      });
      return found;
    }

    let emptyRow = findEmptyRowIndex();
    while(emptyRow !== null) {
      this.elements.splice(emptyRow, 1);
      emptyRow = findEmptyRowIndex();
    }
  }

  insertElement(target, element) {
    if (target.id === 'after') {
      this.elements.push([ element ]);
    } else if (target.beforeRow !== undefined) {
      this.elements.splice(
        target.beforeRow,
        0,
        [ element ]
      );
    } else if (target.beforeElement) {
      const {
        row,
        index
      } = this.findItem(target.beforeElement);
      this.elements[row].splice(index, 0, element);
    } else if (target.afterElement) {
      const {
        row,
        index
      } = this.findItem(target.afterElement);
      this.elements[row].splice(index + 1, 0, element);
    }
  } 

  findItem(id) {
    const out = {
      row: null,
      index: null
    };
    this.elements.forEach((rowElements, row) => {
      rowElements.forEach((element, index) => {
        if (element.id === id) {
          out.row = row;
          out.index = index;
        }
      });
    });
    return out;
  }

  newElement(widget) {
    return {
      type: widget.type,
      id: uuid(),
      data: Object.assign(widget.defaultValues),
      width: 12,
    };
  }
}

decorate(SurfaceManager, {
  config: observable,
  elements: observable,
  activeTarget: observable,
  isDragging: observable,
});
