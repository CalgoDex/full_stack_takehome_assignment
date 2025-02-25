import React, { useEffect } from "react";

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

const ErrorModal: React.FC<{
  dataRow: IDataType | null;
  handleClose: () => void;
}> = ({ dataRow, handleClose }) => {
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
            <strong>Zipcode Error:</strong> {dataRow?.errors?.zipcode?.message}
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
            <strong>Email Severity:</strong> {dataRow?.errors?.email?.severity}
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
            <strong>Phone Severity:</strong> {dataRow?.errors?.phone?.severity}
          </p>
        )}
        <button onClick={handleClose} className="btn btn-danger">
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
