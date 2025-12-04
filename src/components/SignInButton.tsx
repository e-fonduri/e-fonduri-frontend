"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SignInButton = () => {
  const { data: session } = useSession();

  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-sky-600">{session.user.email}</p>
        <Link
          href={"/api/auth/signout"}
          className="flex gap-4 ml-auto text-red-600"
        >
          Sign out
        </Link>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto">
      <Link
        href={"/api/auth/signin"}
        className="flex gap-4 ml-auto text-gren-200 bg-green-600"
      >
        Sign in
      </Link>
      <Link
        href={"/signup"}
        className="flex gap-4 ml-auto text-gren-200 bg-green-600"
      >
        Sign up
      </Link>
    </div>
  );
};

export default SignInButton;
