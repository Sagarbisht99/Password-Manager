"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Passwordform = () => {

  const [form, setForm] = useState({
    url: "",
    Password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    url: "",
    Password: "",
    confirmPassword: "",
    match: "",
  });

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      match: "",
    }));

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { url, Password, confirmPassword } = form;
    let hasError = false;
    const newErrors = {
      url: "",
      Password: "",
      confirmPassword: "",
      match: "",
    };

    if (!url) {
      newErrors.url = "URL is required.";
      hasError = true;
    }

    if (!Password) {
      newErrors.Password = "Password is required.";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
      hasError = true;
    }

    if (Password && confirmPassword && Password !== confirmPassword) {
      newErrors.match = "Passwords do not match.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const response = await fetch(`/api/password/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        form,
      }),
    });

    if (response.ok) {
      toast.success("Your password is saved to store", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
      });

     
    } else {
      toast.error("There was an error saving your password.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
      });
    }

    setForm({ url: "", Password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="bg-[#111] p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Add Passwords
        </h2>

        {/* URL */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Platform or URL</label>
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="e.g. facebook.com"
            className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            name="Password"
            placeholder="Enter your password"
            value={form.Password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.Password && (
            <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter your confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
          {errors.match && (
            <p className="text-red-500 text-sm mt-1">{errors.match}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
        >
          Submit
        </button>
      </form>

      {/* Toast container to display toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default Passwordform;
