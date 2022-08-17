import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { commonModalClasses } from "../../utils/theme";
import { ImSpinner3 } from "react-icons/im";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";

let errorRes;

// Main component
export default function ConfirmPassword() {
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  // User input change handler
  const inputChangeHandler = ({ target }) => {
    const { name, value } = target;

    setPassword({ ...password, [name]: value });
  };

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!password.one.trim()) {
      return updateNotification("error", "Password is missing");
    }
    if (password.one.trim().length < 8) {
      return updateNotification("error", "Password must be 8 chrachters long");
    }
    if (password.one !== password.two) {
      return updateNotification("error", "Passwords don't match");
    }

    const { error, message } = await resetPassword({
      newPassword: password.one,
      userId: id,
      token,
    });

    if (error) {
      return updateNotification("error", error);
    }

    updateNotification("success", message);
    navigate("/auth/signin", { replace: true });
  };

  // Validate token
  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);

    errorRes = error;

    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification("error", error);
    }
    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    setIsValid(true);
  };

  // Use effect
  useEffect(() => {
    isValidToken();
  }, []);

  // Render UI
  if (isVerifying) {
    return (
      <FormContainer>
        <Container>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-thin dark:text-white text-primary">
              Please wait while your credentials are being verified!
            </h1>
            <ImSpinner3 className="animate-spin text-xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );
  }

  if (!isValid) {
    return (
      <FormContainer>
        <Container>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl text-center font-thin dark:text-white text-primary">
              Sorry the credentials are incorrect: <br /> {errorRes}!
            </h1>
          </div>
        </Container>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Container>
        <form onSubmit={submitHandler} className={commonModalClasses + " w-96"}>
          <Title>Please enter new password</Title>

          <FormInput
            type="password"
            name="one"
            value={password.one}
            onChange={inputChangeHandler}
            placeholder="********"
            lable="Password"
          />
          <FormInput
            type="password"
            name="two"
            valie={password.two}
            onChange={inputChangeHandler}
            placeholder="********"
            lable="Confirm Password"
          />

          <Submit value="Reset Password" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
