import { LinearProgress } from "@mui/material";
import React from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../state/UserState";

function getHashParams(url) {
  console.log("getHashParams");
  var hashParams = {};
  var e,
    a = /\+/g, // Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g,
    d = function (s) {
      return decodeURIComponent(s.replace(a, " "));
    },
    q = window.location.hash.substring(1);

  while ((e = r.exec(q))) hashParams[d(e[1])] = d(e[2]);

  return hashParams;
}

// https://baggers-sbx.auth.us-east-1.amazoncognito.com/login?client_id=1lqhhn0samasnkho7tf1pgllfk&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/login

export default function Login() {
  const navigate = useNavigate();
  const url = window.location;
  const { access_token, expires_in, id_token } = useMemo(
    () => getHashParams(url),
    [url]
  );

  userStore((state) => state.setTokens({ access_token, id_token, expires_in }));
  const tokens = userStore((state) => state.tokens);

  if (!tokens.access_token) {
    return <LinearProgress />;
  } else {
    console.log(tokens.access_token);
    navigate("/");
  }
}
