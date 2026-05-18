import { useState, type JSX } from "react";
import style from "./SignIn.module.css";
import { Link } from "react-router";
import { FaApple, FaCheck, FaFacebook, FaGoogle } from "react-icons/fa";
import { SignInForm } from "../../components/SignInForm/SignInForm";

export const SignIn = (): JSX.Element => {
  return (
    <div className={style.SignIn}>
      <header className={style.SignIn__header}>
        <img
          className={style.logo}
          src="./public/images/signInLogo.png"
          alt=""
        />
      </header>

      <main className={style.SignIn__main}>
        <div className={style.SignIn__fastSignIn}>
          <div
            className={`${style.fastSignIn__facebook} ${style.fastSignIn__btn}`}
          >
            <FaFacebook className={style.fackebookIcon} /> Continue with
            Facebook
          </div>

          <div
            className={`${style.fastSignIn__apple} ${style.fastSignIn__btn}`}
          >
            <FaApple className={style.appleIcon} /> Continue with Apple
          </div>

          <div
            className={`${style.fastSignIn__google} ${style.fastSignIn__btn}`}
          >
            <FaGoogle className={style.googleIcon} /> Continue with Google
          </div>
        </div>

        <SignInForm />

        <div className={style.SignIn__signUp}>
          <span className={style.signUp__span}>Don't have an account?</span>
          <Link to={"/sign-up"} className={style.signUp_btn}>
            Sign up for Spotify
          </Link>
        </div>
      </main>
    </div>
  );
};
