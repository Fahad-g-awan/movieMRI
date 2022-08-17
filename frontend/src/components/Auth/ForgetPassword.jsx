import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { forgetPassword } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function ForgetPasword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  // User input change handler
  const inputChangeHandler = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) return updateNotification("error", "Invalid email address");

    const { error, message } = await forgetPassword(email);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
  };

  // Use effect

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  // Render UI
  return (
    <FormContainer>
      <Container>
        <form onSubmit={submitHandler} className={commonModalClasses + " w-96"}>
          <Title>Please enter your email</Title>

          <FormInput
            type="text"
            value={email}
            onChange={inputChangeHandler}
            placeholder="john@email.com"
            lable="Email"
          />

          <Submit value="Submit" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
