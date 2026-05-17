import { useState, type JSX } from "react";
import style from "./SignIn.module.css";
import { Link } from "react-router";
import {
  FaApple,
  FaCheck,
  FaFacebook,
  FaGoogle,
} from "react-icons/fa";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Inputs = {
  email: string;
  password: string;
};

export const SignIn = (): JSX.Element => {
  const [typeForPassword, setTypeForPassword] = useState("password");

  const handlePasswordVisibility = () => {
    if (typeForPassword === "password") setTypeForPassword("text");
    else setTypeForPassword("password");
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

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

        <form className={style.SignIn__form} onSubmit={handleSubmit(onSubmit)}>
          <div className={`${style.form__email} ${style.form__input}`}>
            <span className={`${style.form__span}`}>
              Email address or username
            </span>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email address or username"
            />

            {errors.email && (
              <span className={style.form__error}>Email field is required</span>
            )}
          </div>

          <div className={`${style.form__password} ${style.form__input}`}>
            <span className={`${style.form__span}`}>Password</span>
            <input
              type={typeForPassword}
              {...register("password", { required: true, maxLength: 16 })}
              placeholder="Password"
            />

            {typeForPassword === "password" ? (
              <FiEyeOff
                className={`${style.passwordVisibility} ${style.slashEye}`}
                onClick={() => handlePasswordVisibility()}
              />
            ) : (
              <FiEye
                className={style.passwordVisibility}
                onClick={() => handlePasswordVisibility()}
              />
            )}

            {errors.password && (
              <span className={style.form__error}>
                Password field is required
              </span>
            )}
          </div>

          <Link to={"/"} className={style.form__forgotPassword}>
            Forgot your password?
          </Link>

          <div className={style.form__logIn}>
            <div className={style.logIn__checkbox}>
              <input
                id="checkbox-remember-me"
                type="checkbox"
                className={style.checkbox}
              />
              <label htmlFor="checkbox-remember-me" className={style.checkbox__label}>
                <FaCheck className={style.checkbox__check} />
              </label>
              <label
                htmlFor="checkbox-remember-me"
                className={style.checkbox__span}
              >
                Remember me
              </label>
            </div>

            <button type="submit" className={style.logIn__btn}>
              log In
            </button>
          </div>
        </form>

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
