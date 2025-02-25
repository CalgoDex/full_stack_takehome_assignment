export interface IDataType {
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

export interface IDataReviewTableProps {
  data?: { records: IDataType[] };
}
