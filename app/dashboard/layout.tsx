import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-radial from-black to-slate-800 min-h-screen px-12 py-8 flex flex-col items-center">
      


      <main className="w-full max-w-7xl mt-24">
        {children}
      </main>
    </div>
  );
}