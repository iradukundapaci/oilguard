"use client";
import Link from "next/link";
import React from "react";
import { SignupWithPassword } from "../SignupWithPassword";

export default function Signup() {
  return (
    <>
      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SignupWithPassword />
      </div>
      <div className="mt-6 text-center">
        <p>
          Already have any account?{" "}
          <Link href="/auth/signin" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
