import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { registerValidation } from "../utils/register-validation";
import axios from "axios";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

function Register() {
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  const [values, setValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
  });    
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [errors, setErrors] = useState<RegisterFormValues>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setErrors(registerValidation(values));
    if (errors.name === "" && errors.email === "" && errors.password === "") {

      axios
        .post("/auth/signup", values)
        .then((response) => {
          setShowMessage(true);
          setMessageType("success");
          setMessage(response.data.message);
        })
        .catch((error) => {
          setShowMessage(true);
          setMessageType("danger");
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
        <h2>Sign Up</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong> Name </strong>
            </label>
            <input
              type="name"
              id="name"
              placeholder="Enter Your Name"
              className="form-control rounded-0"
              name="name"
              onChange={handleInput}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong> Email</strong>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              className="form-control rounded-0"
              name="email"
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
              placeholder="Enter Password"
              className="form-control rounded-0"
              name="password"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign up
          </button>
          <p></p>
          {showMessage && (
            <div className={`alert alert-${messageType}`} role="alert">
              {message}
            </div>
          )}
          <Link
            to="/login"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
