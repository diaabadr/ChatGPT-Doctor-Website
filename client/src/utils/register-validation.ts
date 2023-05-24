interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export const registerValidation = (
  values: RegisterFormValues
): RegisterFormErrors => {
  const error: RegisterFormErrors = {};
  const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (values.name === "") {
    error.name = "Name is required";
  } else {
    error.name = "";
  }

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
    error.password =
      "Password should contain a minimum of 8 characters, letters, and numbers";
  } else {
    error.password = "";
  }

  return error;
};
