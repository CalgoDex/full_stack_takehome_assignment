import { IDataType } from "../types/type-definitions";

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "text-danger";
    case "warning":
      return "text-warning";
    default:
      return "text-success";
  }
};

export const convertJsonToCsv = (jsonData: { records: IDataType[] }) => {
  if (!jsonData || jsonData.records.length === 0) {
    return "";
  }

  const headers = [
    "ID",
    "Name",
    "Email",
    "Street",
    "City",
    "Zipcode",
    "Phone",
    "Status",
    "Zipcode Error Message",
    "Zipcode Error Severity",
    "Email Error Message",
    "Email Error Severity",
    "Street Error Message",
    "Street Error Severity",
    "Phone Error Message",
    "Phone Error Severity",
  ];

  const csvRows = [];

  csvRows.push(headers.join(","));

  for (let row = 0; row < jsonData.records.length; row++) {
    const values = [
      jsonData.records[row].id.toString(),
      jsonData.records[row].name ?? "",
      jsonData.records[row].email ?? "",
      jsonData.records[row].street ?? "",
      jsonData.records[row].city ?? "",
      jsonData.records[row].zipcode ?? "",
      jsonData.records[row].phone ?? "",
      jsonData.records[row].status ?? "",
      jsonData.records[row].errors?.zipcode?.message ?? "",
      jsonData.records[row].errors?.zipcode?.severity ?? "",
      jsonData.records[row].errors?.email?.message ?? "",
      jsonData.records[row].errors?.email?.severity ?? "",
      jsonData.records[row].errors?.street?.message ?? "",
      jsonData.records[row].errors?.street?.severity ?? "",
      jsonData.records[row].errors?.phone?.message ?? "",
      jsonData.records[row].errors?.phone?.severity ?? "",
    ];
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
};
