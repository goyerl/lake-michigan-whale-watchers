import React from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../state/UserState";

export default function Logout() {
  const navigate = useNavigate();
  userStore((state) => state.setTokens({}));

  const tokens = userStore((state) => state.tokens);

  if (tokens.access_token) {
    return <div>Loading...</div>;
  } else {
    navigate("/");
  }
}
