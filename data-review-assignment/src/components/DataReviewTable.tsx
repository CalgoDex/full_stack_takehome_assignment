// components/DataReview.tsx
import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface IDataType {
  id: number;
  name: string;
  email: string;
  street: string;
  city: string;
  zipcode: string;
  phone: string;
  status: string;
  errors: {
    zipcode: {
      message: string;
      severity: string;
    };
    street: {
      message: string;
      severity: string;
    };
    email: {
      message: string;
      severity: string;
    };
  };
}
interface IDataReviewTableProps {
  data?: { records: IDataType[] };
}

const DataReviewTable: React.FC<IDataReviewTableProps> = () => {
  const [mockData, setMockData] = useState<IDataType[] | null>(null);
  const [mockDataJson, setMockDataJson] = useState<{
    records: IDataType[];
  } | null>(null);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<IDataType | null>(
    null
  );

  const fetchData = async () => {
    // fetch the data from /api/data using GET method
    const response = await fetch("/api/data", {
      method: "GET",
    });
    const data = await response.json();
    setMockDataJson(data);
    console.log(data);
    return data.records;
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setMockData(await fetchData());
    };
    fetchDataAsync();
  }, [setMockData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-danger";
      case "warning":
        return "text-warning";
      default:
        return "text-success";
    }
  };

  const convertJsonToCsv = (jsonData: { records: IDataType[] }) => {
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
      ];
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  const downloadCsv = (csvData: string, filename = "data.csv") => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (mockDataJson) {
      const csvData = convertJsonToCsv(mockDataJson);
      downloadCsv(csvData);
    }
  };

  const handleRowClick = (index: number, dataRow: IDataType) => {
    setSelectedRow(index);
    setSelectedRowData(dataRow);

    if (!isModalActive) {
      setIsModalActive(true);
    }
  };

  const handleClose = () => {
    setIsModalActive(false);
    setSelectedRow(null);
    setSelectedRowData(null);
  };

  const ErrorModal: React.FC<{
    dataRow: IDataType | null;
  }> = ({ dataRow }) => {
    if (!dataRow) return null;

    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Error Details</h2>
          <p>
            <strong>Zipcode Error:</strong> {dataRow?.errors?.zipcode?.message}
          </p>
          <p>
            <strong>Zipcode Severity:</strong>{" "}
            {dataRow?.errors?.zipcode?.severity}
          </p>
          <p>
            <strong>Email Error:</strong> {dataRow?.errors?.email?.message}
          </p>
          <p>
            <strong>Email Severity:</strong> {dataRow?.errors?.email?.severity}
          </p>
          <p>
            <strong>Street Error:</strong> {dataRow?.errors?.street?.message}
          </p>
          <p>
            <strong>Street Severity:</strong>{" "}
            {dataRow?.errors?.street?.severity}
          </p>
          <button onClick={handleClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    );
  };

  const onModalClick = () => {
    if (selectedRowData) {
      return ErrorModal({ dataRow: selectedRowData });
    }
  };

  if (!mockData) {
    return <div>Loading Data...</div>;
  }

  return (
    <div className="container" style={{ margin: "20px" }}>
      <h1 className="text-green bg-gray-100 font-mono">Data Review</h1>
      <div className="col">
        {mockData && (
          <div className="table-responsive">
            <table key={mockData[0].id} className="table table-dark">
              <thead className="sticky-top top-0">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Street</th>
                  <th scope="col">City</th>
                  <th scope="col">Zipcode</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Zipcode Error Message</th>
                  <th scope="col">Zipcode Error Severity</th>
                  <th scope="col">Email Error Message</th>
                  <th scope="col">Email Error Severity</th>
                  <th scope="col">Street Error Message</th>
                  <th scope="col">Street Error Severity</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((dataRow: IDataType, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(index, dataRow)}
                      className={selectedRow === index ? "selected" : ""}
                    >
                      <th
                        className={getSeverityColor(dataRow?.id.toString())}
                        scope="row"
                      >
                        {dataRow?.id}
                      </th>
                      <td
                        className={getSeverityColor(dataRow?.name)}
                        scope="row"
                      >
                        {dataRow?.name}
                      </td>
                      <td className={getSeverityColor(dataRow?.email)}>
                        {dataRow?.email}
                      </td>
                      <td className={getSeverityColor(dataRow?.street)}>
                        {dataRow?.street}
                      </td>
                      <td className={getSeverityColor(dataRow?.city)}>
                        {dataRow?.city}
                      </td>
                      <td className={getSeverityColor(dataRow?.zipcode)}>
                        {dataRow?.zipcode}
                      </td>
                      <td className={getSeverityColor(dataRow?.phone)}>
                        {dataRow?.phone}
                      </td>
                      <td className={getSeverityColor(dataRow?.status)}>
                        {dataRow?.status}
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.zipcode?.message
                        )}
                      >
                        {dataRow?.errors?.zipcode?.message}
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.zipcode?.severity
                        )}
                        data-tooltip-id={`zipcode-error-${dataRow.id}`}
                        data-tooltip-content={dataRow?.errors?.zipcode?.message}
                      >
                        {dataRow?.errors?.zipcode?.severity}
                        <ReactTooltip id={`zipcode-error-${dataRow.id}`} />
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.email?.message
                        )}
                      >
                        {dataRow?.errors?.email?.message}
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.email?.severity
                        )}
                        data-tooltip-id={`email-error-${dataRow.id}`}
                        data-tooltip-content={dataRow?.errors?.email?.message}
                      >
                        {dataRow?.errors?.email?.severity}
                        <ReactTooltip id={`email-error-${dataRow.id}`} />
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.street?.message
                        )}
                      >
                        {dataRow?.errors?.street?.message}
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.street?.severity
                        )}
                        data-tooltip-id={`street-error-${dataRow.id}`}
                        data-tooltip-content={dataRow?.errors?.street?.message}
                      >
                        {dataRow?.errors?.street?.severity}
                        <ReactTooltip id={`street-error-${dataRow.id}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="btnRow">
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginRight: "10px" }}
          disabled={!isModalActive}
          onClick={onModalClick}
        >
          {(selectedRowData && (
            <div>View ID {selectedRowData.id} Error Summary</div>
          )) ?? <div>View Error Summary</div>}
        </button>
        <button
          onClick={handleExportExcel}
          type="button"
          className="btn btn-success"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default DataReviewTable;
