export const generateColFilters = (columnFilters, columns) => {
  const colFilters = [];
  columnFilters.forEach((element) => {
    element.type = columns.find((x) => x.accessorKey === element.id).filterVariant;
    colFilters.push(element);
  });
  return colFilters;
};
