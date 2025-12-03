import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome to E-Fonduri
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Your platform for managing funds and resources
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <Button href="/signup" variant="primary" fullWidth>
              Sign Up
            </Button>
            <Button href="/login" variant="secondary" fullWidth>
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
