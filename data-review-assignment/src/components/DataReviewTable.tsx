import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IDataType, IDataReviewTableProps } from "../types/type-definitions";
import { getSeverityColor, convertJsonToCsv } from "../helpers";
import ErrorModal from "./ErrorModal";

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
      <ErrorModal dataRow={selectedRowData} handleClose={handleClose} />
    </div>
  );
};

export default DataReviewTable;
