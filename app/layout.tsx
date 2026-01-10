import {
  ClerkProvider,
  PricingTable,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return (
<ClerkProvider>
<html lang="en">
<body className="bg-gradient-radial from-black to-slate-800 min-w-full min-h-screen px-12 py-8 bg-no-repeat flex flex-col items-center">
{/* Navbar */}
<header className="w-full max-w-3xl flex items-center justify-between mb-4 px-9 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
{/* Left: Brand */}
<div className="text-white text-lg font-semibold tracking-wide">
MiApp
</div>


{/* Center: Navigation */}
<SignedIn>
<nav className="hidden md:flex space-x-4 text-white/80 text-sm font-medium">
<a href="/dashboard" className="hover:text-white transition">Dashboard</a>
<a href="/dashboard/docs" className="hover:text-white transition">Docs</a>
<a href="/dashboard/apikey" className="hover:text-white transition">API Key</a>
<a href="/dashboard/budget" className="hover:text-white transition">Budget</a>
</nav>
</SignedIn>


{/* Right: Auth */}
<div>
<SignedOut>
<SignInButton>
<button className="px-3 py-1.5 bg-white/20 border border-white/30 rounded-xl text-white hover:bg-white/30 transition font-medium">
Iniciar sesión
</button>
</SignInButton>
</SignedOut>


<SignedIn>
<UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
</SignedIn>
</div>
</header>


{/* Mobile Nav */}
<SignedIn>
<nav className="md:hidden w-full max-w-3xl flex justify-center mb-3 text-white/80 text-sm space-x-3">
<a href="/dashboard" className="hover:text-white transition">Dashboard</a>
<a href="/dashboard/docs" className="hover:text-white transition">Docs</a>
<a href="/dashboard/apikey" className="hover:text-white transition">API Key</a>
<a href="/dashboard/budget" className="hover:text-white transition">Budget</a>
</nav>
</SignedIn>


<main className="w-full max-w-7xl">{children}</main>
</body>
</html>
</ClerkProvider>
);
}
