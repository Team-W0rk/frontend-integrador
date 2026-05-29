import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Badge } from "../badge/badge";

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    Badge
],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  columns = input<any[]>([]);

  data = input<any[]>([]);

  loading = input(false);

  edit = output<any>();

  remove = output<any>();

  detail = output<any>();

  getValue(
    obj: any,
    field: string,
  ): any {

    return field
      .split('.')
      .reduce(
        (acc, part) => acc?.[part],
        obj,
      );
  }

  getBadgeColor(
    estado: string,
  ): 'green' | 'red' | 'blue' | 'gray' {
    
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'green';
      case 'finalizado':
        return 'blue';
      case 'baja':
        return 'red';
      default:
        return 'gray';
    }
  }
}
