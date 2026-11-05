import { useForm } from "react-hook-form";
import type { HandleDataFormType } from "./signup.types";
import { toast } from "@heroui/react";
import axios from "axios"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import  Loading  from '../../components/Loading/Loading';
``


export default function SignUp() {



  const { register, handleSubmit, formState, setError, getValues,reset } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "onBlur",
  });
  
  const [loading , setLoading] = useState(false)
  const Nav = useNavigate()

  async function handleFormData(values: HandleDataFormType) {
  try {
    setLoading(true)
    const {data} = await axios.post("https://route-posts.routemisr.com/users/signup",values)
    console.log(data)
        toast.success(data.message);
        setTimeout(()=>Nav("/login"),2000)
    setLoading(false)
        
      }catch (error) {
        if (axios.isAxiosError(error)) {
          toast.danger(error.response?.data.message);
        reset()
  }
}finally{
    setLoading(false)
  }
    }
  
  return (
    <>
      {loading && (<Loading loadMsg={"Creating your account..."}/>)}
    <div>
      <h2 className="text-3xl font-bold text-white">Create Account</h2>
      <p className="mt-2 text-gray-400">Join the Nexo community.</p>
      <form onSubmit={handleSubmit(handleFormData)} noValidate>
        <div className=" flex flex-col py-1">
          <label htmlFor="fullName" className="py-1 text-white/80  ">
            FULL NAME <span className="text-acid-lime">*</span>
          </label>
          <input
            {...register("name", {
              required: { value: true, message: "Please Enter Your Name" },
            })}
            name="name"
            placeholder="Enter Your Name"
            type="username"
            id="fullName"
            className={`form-control
      ${
        formState.errors.name
          ? "border-red-400 focus:border-red-400"
          : "border-border-gray focus:border-acid-lime"
      }`}
          />
          {formState.errors.name && (
            <p
              id="name-error"
              role="alert"
              className="mt-1.5 text-xs text-red-400"
            >
              {formState.errors.name.message}
            </p>
          )}
        </div>

        <div className=" flex flex-col py-1">
          <label htmlFor="userName" className="py-1 text-white/80  ">
            USERNAME
          </label>
          <input
            {...register("username")}
            placeholder="Username (optional)"
            type="username"
            id="userName"
            className="form-control"
          />
        </div>

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

        <div className="flex flex-row gap-2.5">
          <div className=" flex flex-col py-1 w-1/2">
            <label htmlFor="dateOfBirth" className="py-1 text-white/80  ">
              DATE OF BIRTH <span className="text-acid-lime">*</span>
            </label>
            <input
              {...register("dateOfBirth", {
                valueAsDate: true,
                required: {
                  value: true,
                  message: " Date of birth is required",
                },
              })}
              placeholder="Enter Your Password"
              type="date"
              id="dateOfBirth"
              className={`form-control
                ${
                  formState.errors.dateOfBirth
                    ? "border-red-400 focus:border-red-400"
                    : "border-border-gray focus:border-acid-lime"
                }
                `}
            />
            {formState.errors.dateOfBirth && (
              <p className="mt-1.5 text-xs text-red-400 ">
                {formState.errors.dateOfBirth?.message}
              </p>
            )}
          </div>

          <div className=" flex flex-col py-1 w-1/2">
            <label htmlFor="gender" className="py-1 rounded">
              SELECT GENDER <span className="text-acid-lime">*</span>
            </label>
            <select
              id="gender"
              className={`form-control
                ${
                  formState.errors.gender
                    ? "border-red-400 focus:border-red-400"
                    : "border-border-gray focus:border-acid-lime"
                }
                `}
              {...register("gender", {
                required: { value: true, message: " Gender is required" },
              })}
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {formState.errors.gender && (
              <p className="mt-1.5 text-xs text-red-400 ">
                {formState.errors.gender?.message}
              </p>
            )}
          </div>
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
        <p></p>
        <div className=" flex flex-col py-1">
          <label htmlFor="confirmPassword" className="py-1 text-white/80  ">
            CONFIRM PASSWARD
          </label>
          <input
            {...register("rePassword", {
              required: { value: true, message: "Repeat Your Password" },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/,
                message:
                  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
              },
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            placeholder="Confirm Password"
            type="Password"
            id="confirmPassword"
            className={` form-control 
              ${
                formState.errors.rePassword
                  ? "border-red-400 focus:border-red-400"
                  : "border-border-gray focus:border-acid-lime"
              }
              `}
          />

          {formState.errors.rePassword && (
            <p id="error-repassword" className="mt-1.5 text-xs text-red-400">
              {formState.errors.rePassword?.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-acid-lime my-3
                     px-6 py-3 font-bold text-deep-black
                     disabled:opacity-50"
        >
          Create New Account
        </button>

      </form>
    </div>
  </>)}
