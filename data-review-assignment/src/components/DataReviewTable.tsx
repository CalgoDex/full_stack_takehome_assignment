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
  };
}
interface IDataReviewTableProps {
  data?: { records: IDataType[] };
}

const DataReviewTable: React.FC<IDataReviewTableProps> = () => {
  const [mockData, setMockData] = useState<IDataType[] | null>(null);

  const fetchData = async () => {
    // fetch the data from /api/data using GET method
    const response = await fetch("/api/data", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    return data.records;
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setMockData(await fetchData());
      console.log("mockData is array? : ", Array.isArray(mockData));
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
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Street</th>
                  <th scope="col">City</th>
                  <th scope="col">Zipcode</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Zipcode Error Message</th>
                  <th scope="col">Zipcode Error Severity</th>
                  <th scope="col">Street Error Message</th>
                  <th scope="col">Street Error Severity</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((dataRow: IDataType) => {
                  return (
                    <tr key={dataRow.id}>
                      <th
                        className={getSeverityColor(dataRow?.name)}
                        scope="row"
                      >
                        {dataRow?.name}
                      </th>
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
                        data-tip
                        data-for={`zipcode-error-${dataRow.id}`}
                      >
                        {dataRow?.errors?.zipcode?.severity}
                        <ReactTooltip
                          id={`zipcode-error-${dataRow.id}`}
                          place="top"
                        >
                          {dataRow?.errors?.zipcode?.message}
                        </ReactTooltip>
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
                        data-tip
                        data-for={`street-error-${dataRow.id}`}
                      >
                        {dataRow?.errors?.street?.severity}
                        <ReactTooltip
                          id={`street-error-${dataRow.id}`}
                          place="top"
                        >
                          {dataRow?.errors?.street?.message}
                        </ReactTooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataReviewTable;
