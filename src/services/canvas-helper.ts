/*eslint-disable */
export default class CanvasHelper {
  public preventMovingObjectsOutsideCanvas(e: any, zoomRatio: number): void {
    const obj = e.target;
    // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
      return;
    }
    obj.setCoords();
    const boundingRect = obj.getBoundingRect();
    // top-left  corner
    if (boundingRect.top < 0 || boundingRect.left < 0) {
      obj.top = Math.max(obj.top * zoomRatio, obj.top * zoomRatio - boundingRect.top + (obj.cornerSize / 2));

    }
    if (boundingRect.left < 0) {
      obj.left = Math.max(obj.left * zoomRatio, obj.left * zoomRatio - boundingRect.left + (obj.cornerSize / 2));
    }
    // bot-right corner
    // TODO: a bug with resizing, when resize top - object move to bottom and blured image resizing wrong, we can detect when got outside bottom - then remove blur
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height
      || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
    }
  }
}
