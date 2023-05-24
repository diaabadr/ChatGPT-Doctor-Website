interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function loginValidation(values: LoginFormValues): LoginFormErrors {
  let error: LoginFormErrors = {};
  const emailPattern: RegExp = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const passwordPattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (values.email === "") {
    error.email = "Email is required";
  } else if (!emailPattern.test(values.email)) {
    error.email = "Email is invalid";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Password is required";
  } else if (!passwordPattern.test(values.password)) {
    error.password = "Password is invalid";
  } else {
    error.password = "";
  }

  return error;
}
