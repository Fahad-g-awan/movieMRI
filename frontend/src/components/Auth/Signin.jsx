import React, { useEffect, useState } from "react";
import { useAuth, useNotification } from "../../hooks";
import { commonModalClasses } from "../../utils/theme";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { isValidEmail } from "../../utils/helper";

// User validation function

const validateUser = ({ email, password }) => {
  if (!email.trim()) return { ok: false, error: "Email is missing" };
  if (!isValidEmail(email)) return { ok: false, error: "Email is invalid" };

  if (!password.trim()) return { ok: false, error: "Password is missing" };
  if (password.length < 8) return { ok: false, error: "Password must be 8 chracters long" };

  return { ok: true };
};

// Main component

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { loginHandler, authInfo } = useAuth();

  const { isPending, isLoggedIn } = authInfo;

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

    loginHandler(userInfo.email, userInfo.password);
  };

  const { email, password } = userInfo;

  // Render UI

  return (
    <div className="fixed inset-0 dark:bg-primary bg-white -z-10 flex justify-center items-center">
      <Container>
        <form onSubmit={submitHandler} className={commonModalClasses + " w-96"}>
          <Title>Sign In</Title>

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

          <Submit value="Sign In" busy={isPending} />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <div className="flex space-x-1 items-center">
              <p className="dark:text-white text-secondary font-semibold text-xs text-center">
                Don't have an account?
              </p>
              <CustomLink to="/auth/signup">Sign Up</CustomLink>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
