import React, { useEffect, useState } from "react";
import { createUser } from "../../api/auth";
import { commonModalClasses } from "../../utils/theme";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";

const validateUser = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing" };
  if (!isValidName.test(name)) return { ok: false, error: "Name is invalid" };

  if (!email.trim()) return { ok: false, error: "Email is missing" };
  if (!isValidEmail(email)) return { ok: false, error: "Email is invalid" };

  if (!password.trim()) return { ok: false, error: "Password is missing" };
  if (password.length < 8) return { ok: false, error: "Password must be 8 chracters long" };

  return { ok: true };
};

// Main component

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  // User input change handler
  const inputChangeHandler = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Submit handler

  const submitHandler = async (e) => {
    e.preventDefault();

    const { ok, error } = validateUser(userInfo);

    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);

    if (response.error) return updateNotification("error", response.error);

    navigate("/auth/verification", { state: { user: response.user }, replace: true });

    console.log(response.user);
  };

  const { name, email, password } = userInfo;

  // useEffect

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  // Redner UI

  return (
    <FormContainer>
      <Container>
        <form onSubmit={submitHandler} className={commonModalClasses + " w-96"}>
          <Title>Sign Up</Title>

          <FormInput
            type="text"
            name="name"
            value={name}
            onChange={inputChangeHandler}
            placeholder="john Doe"
            lable="Name"
          />
          <FormInput
            type="text"
            name="email"
            value={email}
            onChange={inputChangeHandler}
            placeholder="john@email.com"
            lable="Email"
          />
          <FormInput
            type="password"
            name="password"
            value={password}
            onChange={inputChangeHandler}
            placeholder="********"
            lable="Password"
          />

          <Submit value="Sign Up" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signin">Sign In</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
