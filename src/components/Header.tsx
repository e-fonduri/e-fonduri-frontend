import Link from "next/link";
import Button from "./ui/Button";
import SignInButton from "./SignInButton";

interface User {
  email: string;
}

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Greeting */}
          <Link className="transition-colors hover:text-blue-500" href={"/"}>
            Home Page
          </Link>
          <Link
            className="transition-colors hover:text-blue-500"
            href={"/dashboard"}
          >
            Dashboard
          </Link>
          <SignInButton></SignInButton>
        </div>
      </div>
    </header>
  );
}
