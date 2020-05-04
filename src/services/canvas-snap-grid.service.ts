// import { fabric } from 'fabric';
export declare const fabric: any;

export default class CanvasSnapGridService {
  private canvas: fabric.Canvas;

  private gridSize: number = 25;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  public gridSnap(): void {
    this.drawGrid();
    this.snapToTheGrid();
  }

  public removeGrid(): void {
    const grid = this.canvas.getObjects().filter((o) => o.name === 'grid');
    this.canvas.remove(...grid);
  }

  private snapToTheGrid(): void {
    const grid = this.gridSize;
    this.canvas.on('object:moving', (ev: any) => {
      const w = ev.target.width * ev.target.scaleX;
      const h = ev.target.height * ev.target.scaleY;
      // Closest snapping points
      const snap = {
        top: Math.round(ev.target.top / grid) * grid,
        left: Math.round(ev.target.left / grid) * grid,
        bottom: Math.round((ev.target.top + h) / grid) * grid,
        right: Math.round((ev.target.left + w) / grid) * grid,
      };
      const threshold = grid * 0.2;
      // Distance from snapping points
      const dist = {
        top: Math.abs(snap.top - ev.target.top),
        left: Math.abs(snap.left - ev.target.left),
        bottom: Math.abs(snap.bottom - ev.target.top - h),
        right: Math.abs(snap.right - ev.target.left - w),
      };

      if (dist.bottom < dist.top) {
        if (dist.bottom > threshold) {
          snap.top = ev.target.top; // don't snap
        } else {
          snap.top = snap.bottom - h;
        }
      } else if (dist.top > threshold) {
        snap.top = ev.target.top; // don't snap
      }

      if (dist.right < dist.left) {
        if (dist.right > threshold) {
          snap.left = ev.target.left; // don't snap
        } else {
          snap.left = snap.right - w;
        }
      } else if (dist.left > threshold) {
        snap.left = ev.target.left; // don't snap
      }

      ev.target.set({
        top: snap.top,
        left: snap.left,
      });
    });
  }

  private drawGrid(): void {
    const width = this.canvas.getWidth();
    const separateLines = [];
    for (let i = 0; i < width / this.gridSize; i += 1) {
      const horizontalLine = new fabric.Line(
        [i * this.gridSize, 0, i * this.gridSize, width], {
          stroke: '#7ee3e3',
          strokeWidth: 0.5,
        },
      );
      const verticalLine = new fabric.Line(
        [0, i * this.gridSize, width, i * this.gridSize], {
          stroke: '#7ee3e3',
          strokeWidth: 0.5,
        },
      );
      // horizontalLine.name = 'horizontalLine';
      separateLines.push(horizontalLine);
      separateLines.push(verticalLine);
    }

    // add lines to group
    const group = new fabric.Group(separateLines);
    group.selectable = false;
    this.canvas.add(group);
    group.name = 'grid';
    group.hoverCursor = 'default';
    this.canvas.renderAll();
  }
}
