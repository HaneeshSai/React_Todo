import "./css/Home.css";
import { useState } from "react";
import "./App";
import axios from "axios";

export default function SignIn(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userinvalid, setUserInvalid] = useState();
  const [passwordinvalid, setPasswordinvalid] = useState(false);
  const [showpass, setShowpass] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("https://example-host/check-if-exists", {
        username,
        password,
      })
      .then((res) => {
        res.data == "username does not exist"
          ? setUserInvalid(true)
          : setUserInvalid(false);
        res.data == "password incorrect"
          ? setPasswordinvalid(true)
          : setPasswordinvalid(false);
        if (res.data == "password correct") {
          props.onclick("login sucess");
          props.user(username);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="contain">
      <div className="login">
        <div className="head">
          <button className="active-page">Sign-in</button>
          <button
            onClick={() => {
              props.onclick("sign-up");
            }}
            className="inactive-page"
          >
            Sign-Up
          </button>
        </div>
        <div className="enter">
          <form onSubmit={handleSubmit}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              name="usrname"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Username/E-mail"
            />
            <p className={userinvalid ? "user-invalid" : "inactive"}>
              Username does not exist
            </p>

            <i className="fa-solid fa-lock"></i>
            <input
              className="pass"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              name="passwd"
              placeholder="Password"
              id="signup-pass"
            />
            <p className={passwordinvalid ? "pass-invalid" : "inactive"}>
              incorrect password
            </p>
            <div className="signin-eye">
              {showpass ? (
                <i
                  onClick={() => {
                    setShowpass(false);
                    var x = document.getElementById("signup-pass");
                    x.type == "password"
                      ? (x.type = "text")
                      : (x.type = "password");
                  }}
                  className="fa-solid fa-eye"
                  style={{ color: "#cfcfcf" }}
                ></i>
              ) : (
                <i
                  onClick={() => {
                    setShowpass(true);
                    var x = document.getElementById("signup-pass");
                    console.log(x.type);
                    x.type == "text"
                      ? (x.type = "password")
                      : (x.type = "text");
                  }}
                  className="fa-solid fa-eye-slash"
                  style={{ color: "#cfcfcf" }}
                ></i>
              )}
            </div>
            <a href="#" className="frgt-pas">
              Forgot password?
            </a>
            <button className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
