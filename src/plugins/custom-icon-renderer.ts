import { fabric } from 'fabric';

const deleteIcon = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im00MTYgNTEyaC0zMjBjLTUzLjAyMzQzOCAwLTk2LTQyLjk3NjU2Mi05Ni05NnYtMzIwYzAtNTMuMDIzNDM4IDQyLjk3NjU2Mi05NiA5Ni05NmgzMjBjNTMuMDIzNDM4IDAgOTYgNDIuOTc2NTYyIDk2IDk2djMyMGMwIDUzLjAyMzQzOC00Mi45NzY1NjIgOTYtOTYgOTZ6bTAgMCIgZmlsbD0iI2ZmZTZlMiIvPjxwYXRoIGQ9Im0yNTYgMTI4Yy03MC41NzQyMTkgMC0xMjggNTcuNDI1NzgxLTEyOCAxMjhzNTcuNDI1NzgxIDEyOCAxMjggMTI4IDEyOC01Ny40MjU3ODEgMTI4LTEyOC01Ny40MjU3ODEtMTI4LTEyOC0xMjh6bTQ3LjEzNjcxOSAxNjAuMDYyNWM0LjE2MDE1NiA0LjE2MDE1NiA0LjE2MDE1NiAxMC45MTQwNjIgMCAxNS4wODk4NDQtMi4wODIwMzEgMi4wNzgxMjUtNC44MTY0MDcgMy4xMjEwOTQtNy41MzUxNTcgMy4xMjEwOTQtMi43MjI2NTYgMC01LjQ1NzAzMS0xLjA0Mjk2OS03LjUzOTA2Mi0zLjEyMTA5NGwtMzIuMDYyNS0zMi4wNjI1LTMyLjA2MjUgMzIuMDYyNWMtMi4wODIwMzEgMi4wNzgxMjUtNC44MTY0MDYgMy4xMjEwOTQtNy41MzkwNjIgMy4xMjEwOTQtMi43MzQzNzYgMC01LjQ1MzEyNi0xLjA0Mjk2OS03LjUzNTE1Ny0zLjEyMTA5NC00LjE2MDE1Ni00LjE2MDE1Ni00LjE2MDE1Ni0xMC45MTQwNjMgMC0xNS4wODk4NDRsMzIuMDQ2ODc1LTMyLjA2MjUtMzIuMDYyNS0zMi4wNjI1Yy00LjE2MDE1Ni00LjE2MDE1Ni00LjE2MDE1Ni0xMC45MTQwNjIgMC0xNS4wODk4NDQgNC4xNjAxNTYtNC4xNzU3ODEgMTAuOTE0MDYzLTQuMTYwMTU2IDE1LjA4OTg0NCAwbDMyLjA2MjUgMzIuMDYyNSAzMi4wNjI1LTMyLjA2MjVjNC4xNjAxNTYtNC4xNjAxNTYgMTAuOTE0MDYyLTQuMTYwMTU2IDE1LjA4OTg0NCAwIDQuMTc1NzgxIDQuMTYwMTU2IDQuMTYwMTU2IDEwLjkxNDA2MyAwIDE1LjA4OTg0NGwtMzIuMDYyNSAzMi4wNjI1em0wIDAiIGZpbGw9IiNmYzU3M2IiLz48L3N2Zz4=';
const rotateIcon = 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0ODguNDcxIDQ4OC40NzEiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNDg4LjQ3MSA0ODguNDcxIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0zMDUuMjkzIDc2LjMyNC05MS41ODgtNzYuMzI0djYzLjQ5NmMtMTAzLjM5MSAxNC44OTItMTgzLjE3NiAxMDMuODIxLTE4My4xNzYgMjExLjI2OSAwIDExNy44MzkgOTUuODY3IDIxMy43MDYgMjEzLjcwNiAyMTMuNzA2IDEyLjI2OCAwIDI0LjU5Ni0xLjA1OCAzNi42MTEtMy4xM2wtNS4xODgtMzAuMDgyYy0xMC4zMTYgMS43NzQtMjAuODg1IDIuNjgzLTMxLjQyNCAyLjY4My0xMDEuMDA5IDAtMTgzLjE3Ni04Mi4xNjctMTgzLjE3Ni0xODMuMTc2IDAtOTAuNTg3IDY2LjE1My0xNjUuODE2IDE1Mi42NDctMTgwLjQxOXY1OC4zMDFjMC0uMDAxIDkxLjU4OC03Ni4zMjQgOTEuNTg4LTc2LjMyNHoiLz48cGF0aCBkPSJtNDA5LjQ2MiAxOTUuNTc5IDI3LjUxOC0xMy4yMDhjLTE0LjE5MS0yOS41Ni0zNS40MDQtNTUuODg2LTYxLjMxMi03Ni4xMTVsLTE4Ljc4MyAyNC4wNmMyMi4yMjYgMTcuMzY3IDQwLjM5OCAzOS45MzYgNTIuNTc3IDY1LjI2M3oiLz48cGF0aCBkPSJtNDU1LjkgMjQ1LjEtMzAuMjMxIDQuMjA0YzEuMTQ4IDguMzE4IDEuNzQ0IDE2LjgxNSAxLjc0NCAyNS40NjEgMCAxOS44NTYtMy4xNDUgMzkuMzY5LTkuMzYyIDU3Ljk4OGwyOC45NDkgOS42NmM3LjI2LTIxLjczNCAxMC45NDItNDQuNDk3IDEwLjk0Mi02Ny42NDggMC05Ljk1OC0uNjg2LTE5Ljk0Ni0yLjA0Mi0yOS42NjV6Ii8+PHBhdGggZD0ibTMyOC44MDEgNDM3LjMxIDE0LjEwMiAyNy4wNzFjMjkuMDgzLTE1LjE2IDU0LjY5My0zNy4yMDggNzQuMDU4LTYzLjc0MmwtMjQuNjU2LTE4LjAwOGMtMTYuNjIyIDIyLjc3OC0zOC41OCA0MS42OC02My41MDQgNTQuNjc5eiIvPjwvc3ZnPg==';

const deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

const rotateImg = document.createElement('img');
rotateImg.src = rotateIcon;

function renderIcon1(icon: any) {
  return function renderIcon(ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) {
    const size = 24;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

function deleteObject(eventData: any, target: any) {
  const { canvas } = target;
  canvas.remove(target);
  canvas.requestRenderAll();
}

function rotateObject(eventData: any, target: any) {
  console.log('___ eventData', eventData, target); // todo
  const { canvas } = target;
  // target.clone((cloned: any) => {
  //   cloned.left += 10;
  //   cloned.top += 10;
  //   canvas.add(cloned);
  // });
  // canvas.renderAll();
}

/*eslint-disable */
export const renderCustomIcon = () => {
  (fabric as any).Object.prototype.controls.deleteControl = new (fabric as any).Control({
    position: { x: 0.5, y: -0.5 },
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon1(deleteImg),
    cornerSize: 32,
    actionHandler: () => {},
  });
};
