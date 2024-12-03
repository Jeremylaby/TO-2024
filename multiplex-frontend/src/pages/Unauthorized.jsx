import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 border rounded shadow bg-white">
        <h1 className="display-4 text-danger">403</h1>
        <h2 className="mb-4">Brak dostępu</h2>
        <p className="text-muted">
          Nie masz odpowiednich uprawnień, aby zobaczyć tę stronę.
        </p>
        <button className="btn btn-primary mt-3" onClick={goToHomePage}>
          Powrót do strony głównej
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
