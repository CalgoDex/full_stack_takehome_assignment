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
    phone: {
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
    const modalRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, []);

    if (!dataRow || !dataRow.errors) return null;

    return (
      <div className="modal-overlay" onClick={handleClose} ref={modalRef}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          <h2>Error summary for ID: {dataRow?.id}</h2>
          {dataRow?.errors?.zipcode?.message && (
            <p>
              <strong>Zipcode Error:</strong>{" "}
              {dataRow?.errors?.zipcode?.message}
            </p>
          )}

          {dataRow?.errors?.zipcode?.severity && (
            <p>
              <strong>Zipcode Severity:</strong>{" "}
              {dataRow?.errors?.zipcode?.severity}
            </p>
          )}
          {dataRow?.errors?.email?.message && (
            <p>
              <strong>Email Error:</strong> {dataRow?.errors?.email?.message}
            </p>
          )}

          {dataRow?.errors?.email?.severity && (
            <p>
              <strong>Email Severity:</strong>{" "}
              {dataRow?.errors?.email?.severity}
            </p>
          )}
          {dataRow?.errors?.street?.message && (
            <p>
              <strong>Street Error:</strong> {dataRow?.errors?.street?.message}
            </p>
          )}
          {dataRow?.errors?.street?.severity && (
            <p>
              <strong>Street Severity:</strong>{" "}
              {dataRow?.errors?.street?.severity}
            </p>
          )}
          {dataRow?.errors?.phone?.message && (
            <p>
              <strong>Phone Error:</strong> {dataRow?.errors?.phone?.message}
            </p>
          )}
          {dataRow?.errors?.phone?.severity && (
            <p>
              <strong>Phone Severity:</strong>{" "}
              {dataRow?.errors?.phone?.severity}
            </p>
          )}
          <button onClick={handleClose} className="btn btn-danger">
            Close
          </button>
        </div>
      </div>
    );
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
                  <th
                    scope="col"
                    data-tooltip-id={`zipcode-EM-title`}
                    data-tooltip-content={`Zipcode Error Message`}
                  >
                    {`ZEM`}
                    <ReactTooltip id={`zipcode-EM-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`zipcode-ES-title`}
                    data-tooltip-content={`Zipcode Error Severity`}
                  >
                    ZES
                    <ReactTooltip id={`zipcode-ES-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`email-EM-title`}
                    data-tooltip-content={`Email Error Message`}
                  >
                    EEM
                    <ReactTooltip id={`email-EM-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`email-ES-title`}
                    data-tooltip-content={`Email Error Severity`}
                  >
                    EES
                    <ReactTooltip id={`email-ES-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`street-EM-title`}
                    data-tooltip-content={`Street Error Message`}
                  >
                    SEM
                    <ReactTooltip id={`street-EM-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`street-ES-title`}
                    data-tooltip-content={`Street Error Severity`}
                  >
                    SES
                    <ReactTooltip id={`street-ES-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`phone-EM-title`}
                    data-tooltip-content={`Phone Error Message`}
                  >
                    PEM
                    <ReactTooltip id={`phone-EM-title`} />
                  </th>
                  <th
                    scope="col"
                    data-tooltip-id={`phone-ES-title`}
                    data-tooltip-content={`Phone Error Severity`}
                  >
                    PES
                    <ReactTooltip id={`phone-ES-title`} />
                  </th>
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
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.phone?.message
                        )}
                      >
                        {dataRow?.errors?.phone?.message}
                      </td>
                      <td
                        className={getSeverityColor(
                          dataRow?.errors?.phone?.severity
                        )}
                        data-tooltip-id={`phone-error-${dataRow.id}`}
                        data-tooltip-content={dataRow?.errors?.phone?.message}
                      >
                        {dataRow?.errors?.phone?.severity}
                        <ReactTooltip id={`phone-error-${dataRow.id}`} />
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
          onClick={handleExportExcel}
          type="button"
          className="btn btn-success"
        >
          Export Excel
        </button>
      </div>
      <ErrorModal dataRow={selectedRowData} />
    </div>
  );
};

export default DataReviewTable;
