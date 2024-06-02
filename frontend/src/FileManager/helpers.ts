interface File {
  fileName: string; // Renamed from 'name'
  size: number;
  created: string;
}

interface Order {
  field: string;
  orderBy: string;
}

export const sortFilter = (filesList: File[], order: Order): File[] => {
  let sortedFiles: File[] = [];

  switch (order.field) {
    case "name":
      sortedFiles = filesList.sort((a, b) => {
        const x = a.fileName.toLowerCase(); // Changed from 'name'
        const y = b.fileName.toLowerCase(); // Changed from 'name'
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      break;

    case "size":
      sortedFiles = filesList.sort((a, b) => a.size - b.size);
      break;

    case "date":
      sortedFiles = filesList.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
      break;

    default:
      sortedFiles = filesList;
      break;
  }

  return order.orderBy === "asc" ? sortedFiles : sortedFiles.reverse();
};
