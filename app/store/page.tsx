"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Password {
  _id: string;
  url: string;
  confirmPassword: string;
}

export default function StorePage() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{
    id: string;
    url: string;
    confirmPassword: string;
  }>({
    id: "",
    url: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const res = await fetch("/api/password/read", {
          method: "GET",
        });
        const data = await res.json();

        // Ensure data is in the correct format (array of passwords)
        if (Array.isArray(data.passwords)) {
          setPasswords(data.passwords);
        } else {
          console.error("Invalid data format", data);
        }
      } catch (err) {
        console.error("Failed to fetch passwords", err);
      }
    };

    fetchPasswords();
  }, []);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch("/api/password/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedId }),
      });

      if (res.ok) {
        setPasswords((prev) => prev.filter((p) => p._id !== selectedId));
        toast.success("🗑️ Password deleted", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
        });
        setShowModal(false);
        setSelectedId(null);
      } else {
        toast.error("❌ Failed to delete password");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong!");
      console.error(err);
    }
  };

  const handleEditClick = (password: Password) => {
    setEditForm({
      id: password._id,
      url: password.url,
      confirmPassword: password.confirmPassword,
    });
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch("/api/password/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success("✅ Password updated", {
          position: "bottom-center",
          autoClose: 2000,
          theme: "dark",
        });

        setPasswords((prev) =>
          prev.map((p) =>
            p._id === editForm.id
              ? {
                  ...p,
                  url: editForm.url,
                  confirmPassword: editForm.confirmPassword,
                }
              : p
          )
        );

        setEditModal(false);
      } else {
        toast.error("❌ Failed to update password");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-10 text-center">Stored Passwords</h1>

      {passwords && passwords.length === 0 ? (
        <p className="text-center text-gray-400">No passwords stored yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {passwords.map((item) => (
            <form
              key={item._id}
              className="bg-[#111] cursor-pointer border border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <label className="block text-sm text-gray-400 mb-1">URL</label>
              <input
                value={item.url}
                readOnly
                className="w-full mb-4 px-3 py-2 rounded-lg bg-transparent border border-gray-600 text-white"
              />

              <label className="block text-sm text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  value={item.confirmPassword}
                  readOnly
                  type={visiblePasswords[item._id] ? "text" : "password"}
                  className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-600 text-white"
                />
                <span
                  onClick={() => togglePasswordVisibility(item._id)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {visiblePasswords[item._id] ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => handleEditClick(item)}
                  className="px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item._id);
                    setShowModal(true);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-200 bg-red-700 hover:bg-red-600 rounded-md"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
          <Link href="/">
            <button className="bg-green-500 hover:bg-green-600 p-3 rounded-xl text-black font-semibold transition-colors duration-200">
              Add Password
            </button>
          </Link>
        </ul>
      )}

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111]  rounded-xl p-8 shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-400 mb-6">
              Do you really want to delete this password?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] rounded-xl p-8 shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Password</h2>

            <input
              value={editForm.url}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="URL"
              className="w-full mb-3 px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white"
            />

            <input
              value={editForm.confirmPassword}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Password"
              className="w-full mb-6 px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
