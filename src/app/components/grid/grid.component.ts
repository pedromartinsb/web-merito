import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
  @Input() outerGrids: number[] = [1, 2, 3, 4];
  @Input() innerGrids: number[] = [1, 2];
}
