export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null)[][]
): void {
  const separator = ';';
  const csvContent = [
    headers.join(separator),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const value = cell ?? '';
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(separator)
    ),
  ].join('\n');

  const blob = new Blob(
    ['\ufeff' + csvContent],
    {
      type: 'text/csv;charset=utf-8;',
    },
  );

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}