"use client"

import React, { useState } from "react";

function Signup() {
  const data = {
    name: "",
    email: "",
    password:""
  };

  const [inputData, setInputData] = useState(data);
  const [msg, setmsg] = useState(false);

  const handleinput = (event:React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };
  const submit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputData.name || !inputData.email || !inputData.password) {
      alert("All Feilds are mandatory");
    } else {
      setmsg(true);
      setTimeout(() => {
        setmsg(false);
      }, 4000);
    }
  };

  return (
    <form onSubmit={submit} className="container">
      <h2>{msg ? inputData.name + ":Login Successfully" : null}</h2>
      <h1>Login</h1>
      <div className="input">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={inputData.name}
          onChange={handleinput}
        ></input>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={inputData.email}
          onChange={handleinput}
        ></input>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={inputData.password}
          onChange={handleinput}
        ></input>
      </div>
      <button>Submit</button>
    </form>
  );
}

export default Signup;

