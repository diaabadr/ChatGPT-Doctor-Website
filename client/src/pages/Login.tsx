import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginValidation } from "../utils/login-validation";
import axios from "axios";

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
  const [errors, setErrors] = useState<LoginFormValues>({});
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
    setErrors(loginValidation(values));
    if (errors.email === "" && errors.password === "") {
      console.log(errors);
      axios
        .post("/auth/login", values)
        .then((response) => {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          navigate("/");

        })
        .catch((error) => {
          setShowMessage(true);
          console.log(error);
          setMessage(error.response.data.error);
        });
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100 background-image">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong> Email</strong>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              className="form-control rounded-0"
              onChange={handleInput}
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong> Password</strong>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
          <p></p>
          {showMessage && (
            <div className={`alert alert-danger`} role="alert">
              {message}
            </div>
          )}
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
