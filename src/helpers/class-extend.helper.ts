export declare const fabric: any;
/*eslint-disable */
export const FabricGroupFormatter = fabric.util.createClass(fabric.Group, {
  original: null,
  erasedPath: null,
  initialize: function (original: any, erasedPath: any, options: any, isAlreadyGrouped: any) {
    this.original = original;
    this.erasedPath = erasedPath;
    this.callSuper('initialize', [this.original, this.erasedPath], options, isAlreadyGrouped);
  },

  _calcBounds: function (onlyWidthHeight: any) {
    const aX: any = [],
      aY: any = [],
      props = ['tr', 'br', 'bl', 'tl'],
      jLen = props.length,
      ignoreZoom = true;

    let o = this.original;
    o.setCoords(ignoreZoom);
    for (let j = 0; j < jLen; j++) {
      const prop = props[j];
      aX.push(o.oCoords[prop].x);
      aY.push(o.oCoords[prop].y);
    }

    this._getBounds(aX, aY, onlyWidthHeight);
  },
});
