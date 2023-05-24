export const registerValidation = (values) => {
  let error = {};
  const email_pattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (values.name === "") {
    error.name = "Name is required";
  } else {
    error.name = "";
  }

  if (values.email === "") {
    error.email = "Email is required";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email is invalid";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Password is required";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Password Should Contain Min 8 Characters, Letters and Numbers";
  } else {
    error.password = "";
  }

  return error;
};


export function loginValidation(values) {
  let error = {};
  const email_pattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (values.email === "") {
    error.email = "Email is required";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email is invalid";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Password is required";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password is invalid";
  } else {
    error.password = "";
  }

  return error;
}
