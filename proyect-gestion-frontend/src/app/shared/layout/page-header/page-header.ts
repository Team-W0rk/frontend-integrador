import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  title = input.required<string>();

  subtitle = input<string>('');

  backRoute = input<string | null>(null);

  backLabel = input('Volver');

  showSearch = input(false);

  searchPlaceholder = input('Buscar...');

  search = output<string>();

  createRoute = input<string | null>(null);

  createLabel = input('Agregar');

  exportPdf = input(false);

  exportExcel = input(false);

  exportPdfClick = output<void>();

  exportExcelClick = output<void>();

}
