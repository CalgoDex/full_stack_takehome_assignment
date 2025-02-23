// components/DataReview.tsx

import React, { useEffect, useState } from "react";

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

  if (!mockData) {
    return <div>Loading Data...</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <h1 className="text-green bg-gray-100 font-mono">Data Review</h1>
      <div>
        {mockData && (
          <table key={mockData[0].id} className="bg-gray-100 p-2 m-2 w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Street</th>
                <th>City</th>
                <th>Zipcode</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Zipcode Error Message</th>
                <th>Zipcode Error Severity</th>
                <th>Street Error Message</th>
                <th>Street Error Severity</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((dataRow: IDataType) => {
                return (
                  <tr>
                    <td>{dataRow?.name}</td>
                    <td>{dataRow?.email}</td>
                    <td>{dataRow?.street}</td>
                    <td>{dataRow?.city}</td>
                    <td>{dataRow?.zipcode}</td>
                    <td>{dataRow?.phone}</td>
                    <td>{dataRow?.status}</td>
                    <td>{dataRow?.errors?.zipcode?.message}</td>
                    <td>{dataRow?.errors?.zipcode?.severity}</td>
                    <td>{dataRow?.errors?.street?.message}</td>
                    <td>{dataRow?.errors?.street?.severity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataReviewTable;