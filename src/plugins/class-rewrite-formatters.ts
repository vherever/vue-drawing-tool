/*eslint-disable */
// import { fabric } from 'fabric';
declare const fabric: any;

let target: any;

export const rewriteControlsFormatter = (canvas: fabric.Canvas) => {
  /*
  (fabric as any).Object.prototype.controls.rotateControl = new (fabric as any).Control({
    position: { x: 0.5, y: -0.5 },
    offsetY: 24,
    offsetX: 24,
    cursorStyle: 'pointer',
    mouseUpHandler: () => {
      // canvas.getActiveObject().setAngle(20).setCoords();
    },
    render: renderIcon,
    cornerSize: 24,
    // actionHandler: (e: any, transform: any, x: number, y: number) => {
      // @ts-ignore
      // canvas.on('custom:event', () => {
      //   // console.log('___ DDD'); // todo
      // });
      // canvas.trigger('object:rotating', (e1: any) => {
      //   console.log('___ e123', e1); // todo
      // });
      // canvas.fire('object:rotating', {e, transform, pointer: {x, y}, target});
    // }
    actionHandler: fabric.controlHandlers.rotationWithSnapping
  });
   */


  (fabric as any).Object.prototype.drawControls = function (ctx: CanvasRenderingContext2D, styleOverride: any) {
    // styleOverride.hoverCursor = 'pointer';
    if (!this.hasControls) {
      return this;
    }

    const wh = this._calculateCurrentDimensions(),
      width = wh.x,
      height = wh.y,
      scaleOffset = this.cornerSize,
      left = -(width + scaleOffset) / 2,
      top = -(height + scaleOffset) / 2,
      methodName = this.transparentCorners ? 'stroke' : 'fill';

    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
    if (!this.transparentCorners) {
      ctx.strokeStyle = this.cornerStrokeColor;
    }
    this._setLineDash(ctx, this.cornerDashArray, null);

    // top-left
    // this._drawControl('tl', ctx, methodName,
    //   left,
    //   top);
    //
    // // top-right
    // this._drawControl('tr', ctx, methodName,
    //   left + width,
    //   top);
    //
    // // bottom-left
    // this._drawControl('bl', ctx, methodName,
    //   left,
    //   top + height);
    //
    // // bottom-right
    // this._drawControl('br', ctx, methodName,
    //   left + width,
    //   top + height);
    //
    // if (!this.get('lockUniScaling')) {
    //
    //   // middle-top
    //   this._drawControl('mt', ctx, methodName,
    //     left + width / 2,
    //     top);
    //
    //   // middle-bottom
    //   this._drawControl('mb', ctx, methodName,
    //     left + width / 2,
    //     top + height);
    //
    //   // middle-right
    //   this._drawControl('mr', ctx, methodName,
    //     left + width,
    //     top + height / 2);
    //
    //   // middle-left
    //   this._drawControl('ml', ctx, methodName,
    //     left,
    //     top + height / 2);
    // }

    // middle-top-rotate
    this.cornerSize = 24;
    if (this.hasRotatingPoint) {
      let rotate = new Image(), rotateLeft, rotateTop;
      rotate.src = 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0ODguNDcxIDQ4OC40NzEiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNDg4LjQ3MSA0ODguNDcxIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0zMDUuMjkzIDc2LjMyNC05MS41ODgtNzYuMzI0djYzLjQ5NmMtMTAzLjM5MSAxNC44OTItMTgzLjE3NiAxMDMuODIxLTE4My4xNzYgMjExLjI2OSAwIDExNy44MzkgOTUuODY3IDIxMy43MDYgMjEzLjcwNiAyMTMuNzA2IDEyLjI2OCAwIDI0LjU5Ni0xLjA1OCAzNi42MTEtMy4xM2wtNS4xODgtMzAuMDgyYy0xMC4zMTYgMS43NzQtMjAuODg1IDIuNjgzLTMxLjQyNCAyLjY4My0xMDEuMDA5IDAtMTgzLjE3Ni04Mi4xNjctMTgzLjE3Ni0xODMuMTc2IDAtOTAuNTg3IDY2LjE1My0xNjUuODE2IDE1Mi42NDctMTgwLjQxOXY1OC4zMDFjMC0uMDAxIDkxLjU4OC03Ni4zMjQgOTEuNTg4LTc2LjMyNHoiLz48cGF0aCBkPSJtNDA5LjQ2MiAxOTUuNTc5IDI3LjUxOC0xMy4yMDhjLTE0LjE5MS0yOS41Ni0zNS40MDQtNTUuODg2LTYxLjMxMi03Ni4xMTVsLTE4Ljc4MyAyNC4wNmMyMi4yMjYgMTcuMzY3IDQwLjM5OCAzOS45MzYgNTIuNTc3IDY1LjI2M3oiLz48cGF0aCBkPSJtNDU1LjkgMjQ1LjEtMzAuMjMxIDQuMjA0YzEuMTQ4IDguMzE4IDEuNzQ0IDE2LjgxNSAxLjc0NCAyNS40NjEgMCAxOS44NTYtMy4xNDUgMzkuMzY5LTkuMzYyIDU3Ljk4OGwyOC45NDkgOS42NmM3LjI2LTIxLjczNCAxMC45NDItNDQuNDk3IDEwLjk0Mi02Ny42NDggMC05Ljk1OC0uNjg2LTE5Ljk0Ni0yLjA0Mi0yOS42NjV6Ii8+PHBhdGggZD0ibTMyOC44MDEgNDM3LjMxIDE0LjEwMiAyNy4wNzFjMjkuMDgzLTE1LjE2IDU0LjY5My0zNy4yMDggNzQuMDU4LTYzLjc0MmwtMjQuNjU2LTE4LjAwOGMtMTYuNjIyIDIyLjc3OC0zOC41OCA0MS42OC02My41MDQgNTQuNjc5eiIvPjwvc3ZnPg==';
      rotateLeft = left + width / 2;
      rotateTop = top - this.rotatingPointOffset;
      ctx.drawImage(rotate, rotateLeft, rotateTop, 24, 24);
    }

    ctx.restore();

    return this;
  }
}

const icon = 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0ODguNDcxIDQ4OC40NzEiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNDg4LjQ3MSA0ODguNDcxIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0zMDUuMjkzIDc2LjMyNC05MS41ODgtNzYuMzI0djYzLjQ5NmMtMTAzLjM5MSAxNC44OTItMTgzLjE3NiAxMDMuODIxLTE4My4xNzYgMjExLjI2OSAwIDExNy44MzkgOTUuODY3IDIxMy43MDYgMjEzLjcwNiAyMTMuNzA2IDEyLjI2OCAwIDI0LjU5Ni0xLjA1OCAzNi42MTEtMy4xM2wtNS4xODgtMzAuMDgyYy0xMC4zMTYgMS43NzQtMjAuODg1IDIuNjgzLTMxLjQyNCAyLjY4My0xMDEuMDA5IDAtMTgzLjE3Ni04Mi4xNjctMTgzLjE3Ni0xODMuMTc2IDAtOTAuNTg3IDY2LjE1My0xNjUuODE2IDE1Mi42NDctMTgwLjQxOXY1OC4zMDFjMC0uMDAxIDkxLjU4OC03Ni4zMjQgOTEuNTg4LTc2LjMyNHoiLz48cGF0aCBkPSJtNDA5LjQ2MiAxOTUuNTc5IDI3LjUxOC0xMy4yMDhjLTE0LjE5MS0yOS41Ni0zNS40MDQtNTUuODg2LTYxLjMxMi03Ni4xMTVsLTE4Ljc4MyAyNC4wNmMyMi4yMjYgMTcuMzY3IDQwLjM5OCAzOS45MzYgNTIuNTc3IDY1LjI2M3oiLz48cGF0aCBkPSJtNDU1LjkgMjQ1LjEtMzAuMjMxIDQuMjA0YzEuMTQ4IDguMzE4IDEuNzQ0IDE2LjgxNSAxLjc0NCAyNS40NjEgMCAxOS44NTYtMy4xNDUgMzkuMzY5LTkuMzYyIDU3Ljk4OGwyOC45NDkgOS42NmM3LjI2LTIxLjczNCAxMC45NDItNDQuNDk3IDEwLjk0Mi02Ny42NDggMC05Ljk1OC0uNjg2LTE5Ljk0Ni0yLjA0Mi0yOS42NjV6Ii8+PHBhdGggZD0ibTMyOC44MDEgNDM3LjMxIDE0LjEwMiAyNy4wNzFjMjkuMDgzLTE1LjE2IDU0LjY5My0zNy4yMDggNzQuMDU4LTYzLjc0MmwtMjQuNjU2LTE4LjAwOGMtMTYuNjIyIDIyLjc3OC0zOC41OCA0MS42OC02My41MDQgNTQuNjc5eiIvPjwvc3ZnPg==';
const img = new Image();
img.src = icon;

function renderIcon(ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) {
  target = fabricObject;
  const size: number = 24;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}
