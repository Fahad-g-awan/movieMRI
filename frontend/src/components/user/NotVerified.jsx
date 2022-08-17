import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";

export default function NotVerified() {
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;

  const navigate = useNavigate();

  // Navigation method
  const navigateToVerification = () => {
    navigate("/auth/verification", { state: { user: authInfo.profile } });
  };

  // Render UI
  return (
    <Container className="max-w-lg">
      {isLoggedIn && !isVerified ? (
        <p className="text-center bg-blue-50 p-2 font-medium">
          Looks like you havn't verified your account,{" "}
          <button
            onClick={navigateToVerification}
            className="text-blue-500 font-medium hover:underline "
          >
            click here to verify now
          </button>
        </p>
      ) : null}
    </Container>
  );
}
