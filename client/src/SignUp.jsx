import { useState } from "react";
import SignIn from "./SignIn";
import axios from "axios";

const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{2,18}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{3,24}$/;

export default function SignUp(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [userdetail, setUserdetail] = useState(false);
  const [passdetail, setPassDetail] = useState(false);
  const [checkpop, setCheckpop] = useState(false);
  const [correct, setCorrect] = useState("do not match");
  const [sucess, setSucess] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [showpass, setShowpass] = useState(false);

  const validate = async (e) => {
    e.preventDefault();
    if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
      if (!USER_REGEX.test(username)) setUserdetail(true);
      else setUserdetail(false);

      if (!PWD_REGEX.test(password)) setPassDetail(true);
      else setPassDetail(false);
    } else {
      setUserdetail(false);
      setPassDetail(false);

      axios
        .post("https://example-host/check-if-exists", {
          username,
          password,
        })
        .then((res) => {
          if (res.data == "username does not exist") {
            setUsernameExists(false);
            axios
              .post("https://example-host/register-new-user", {
                username,
                password,
              })
              .then((res) => {
                props.onclick("login sucess");
                props.user(username);
                console.log(res.data);
              });
          } else {
            setUsernameExists(true);
            console.log(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="contain">
      <div className="login">
        <div className="head">
          <button
            onClick={() => props.onclick("sign-in")}
            className="inactive-page"
          >
            Sign-in
          </button>
          <button className="active-page">Sign-Up</button>
        </div>
        <div className="enter">
          <form onSubmit={validate}>
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
            <p className={usernameExists ? "userExists" : "inactive"}>
              username already exists use another username
            </p>

            <ul className={userdetail ? "user-active" : "inactive"}>
              <li>username must contain atleast 5 - 18 characters</li>
              <li>username must can only contain a-z, A-Z, 0-9, _ </li>
            </ul>

            <i className="fa-solid fa-lock"></i>
            <input
              className="pass"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setCheckpop(true);
                if (password == e.target.value) setCorrect("matched");
                else setCorrect("do not match");
                if (e.target.value.length > 0) setCheckpop(true);
                else setCheckpop(false);
              }}
              name="passwd"
              placeholder="Password"
              id="signup-pass"
            />
            <ul className={passdetail ? "pass-active" : "inactive"}>
              <li>password must contain atleast 8 - 24 characters</li>
              <li>
                password must contain atleast one small letter, one capital
                letter, one number, one special character{" "}
              </li>
            </ul>
            <input
              className="pass"
              type="password"
              required
              value={confirmpass}
              onChange={(e) => {
                setConfirmpass(e.target.value);
                setCheckpop(true);
                if (password == e.target.value) setCorrect("matched");
                else setCorrect("do not match");
                if (e.target.value.length > 0) setCheckpop(true);
                else setCheckpop(false);
              }}
              name="confirm-passwd"
              placeholder="confirm-Password"
              id="signup-pass"
            />
            <div className={checkpop ? "pass-notif" : "inactive"}>
              <p>Passwords {correct}</p>
            </div>
            <div className="icons">
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
            <button className="login-btn">Sign-Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}
