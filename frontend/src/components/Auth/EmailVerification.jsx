import React, { useEffect, useRef, useState } from "react";
import { commonModalClasses } from "../../utils/theme";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";

const OTP_LENGTH = 6;
let currentOtpIndex;

// OTP validation
const isValidOtp = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = isNaN(parseInt(val));
    if (!valid) break;
  }

  return valid;
};

// Main component
export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const { updateNotification } = useNotification();
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  const inputRef = useRef();

  // Foucs change handlers
  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevinputFeild = (index) => {
    let prevIndex;
    const diff = index - 1;

    prevIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(prevIndex);
  };

  // User input change handler
  const otpChangeHandler = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp];

    newOtp[currentOtpIndex] = value.substring(value.length - 1, value.length);

    if (!value) focusPrevinputFeild(currentOtpIndex);
    else focusNextInputField(currentOtpIndex);

    setOtp([...newOtp]);
  };

  // Key down handler
  const keyDownHandler = ({ key }, index) => {
    currentOtpIndex = index;
    if (key === "Backspace") {
      focusPrevinputFeild(index);
    }
  };

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (isValidOtp(otp)) return updateNotification("error", "Invalid OTP");

    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({ OTP: otp.join(""), userId: user.id });

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  // Use effects
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) navigate("/not-found");
    if (isLoggedIn) navigate("/");
  }, [user, isLoggedIn]);

  // Reder UI
  return (
    <FormContainer>
      <Container>
        <form onSubmit={submitHandler} className={commonModalClasses}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email: {user?.email}
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  key={index}
                  ref={activeOtpIndex === index ? inputRef : null}
                  value={otp[index] || ""}
                  onChange={otpChangeHandler}
                  onKeyDown={(e) => keyDownHandler(e, index)}
                  type="number"
                  className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none dark:text-white text-primary"
                />
              );
            })}
          </div>

          <Submit value="Verify Account" />
        </form>
      </Container>
    </FormContainer>
  );
}
