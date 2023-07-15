import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Todo from "./Todo";

export default function App() {
  const [Data, setData] = useState("sign-in");
  const [username, setusername] = useState("");
  const getdata = (data) => {
    console.log(data);
    setData(data);
  };

  const getuser = (user) => {
    setusername(user);
  };

  switch (Data) {
    case "sign-in":
      return <SignIn onclick={getdata} user={getuser} />;
      break;

    case "sign-up":
      return <SignUp onclick={getdata} user={getuser} />;
      break;

    case "login sucess":
      return <Todo onclick={getdata} user={username} />;
  }
}
