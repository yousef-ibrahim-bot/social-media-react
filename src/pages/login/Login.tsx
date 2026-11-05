import { useForm } from "react-hook-form";
import { toast } from "@heroui/react";
import axios from "axios";
import { useContext, useState } from "react";
import type { loginType } from "./signin.types";
import { CreatedAuthenticationContext } from "../../Context/authContext";
import {  useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate()
   
  const {addDataToToken} = useContext(CreatedAuthenticationContext)!

  const { register, handleSubmit, formState, reset } =
    useForm({
      defaultValues: {
        email: "",
        password: "",
      },
      mode: "onBlur",
    });

  const [Loading, setLoading] = useState(false);
  async function handleFormData(values: loginType) {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );
      console.log(data);
      addDataToToken(data.data.token)
      toast.success(data.message);
      reset();
      navigate("/home");
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.danger(error.response?.data.message);
        reset();
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
      <p className="mt-2 text-gray-400">Login to your the Nexo  account.</p>
      <form onSubmit={handleSubmit(handleFormData)} noValidate>
        <div>
          <label htmlFor="email" className="py-1  block text-white">
            EMAIL ADDRESS <span className="text-acid-lime">*</span>
          </label>

          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className={`form-control
      ${
        formState.errors.email
          ? "border-red-400 focus:border-red-400"
          : "border-border-gray focus:border-acid-lime"
      }`}
            placeholder="you@example.com"
          />

          {formState.errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1.5 text-xs text-red-400"
            >
              {formState.errors.email.message}
            </p>
          )}
        </div>

        <div className=" flex flex-col py-1">
          <label htmlFor="Password" className="py-1 text-white/80  ">
            PASSWARD
          </label>
          <input
            {...register("password", {
              required: { value: true, message: "Password is required" },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/,
                message:
                  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
              },
            })}
            placeholder="At least 8 characters"
            type="Password"
            id="Password"
            className={` form-control  ${
              formState.errors.password
                ? "border-red-400 focus:border-red-400"
                : "border-border-gray focus:border-acid-lime"
            } `}
          />
          {formState.errors.password && (
            <p id="error-password" className="mt-1.5 text-xs text-red-400">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={Loading}
          className="w-full rounded-xl bg-acid-lime my-3
                     px-6 py-3 font-bold text-deep-black
                     disabled:opacity-50"
        >
          Log In
        </button>
        <a className="block text-center text-acid-lime">Forget password?</a>
      </form>
    </div>
  );
}
