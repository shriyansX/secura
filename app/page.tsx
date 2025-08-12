import { AddCard } from "@/components/add-card"
import { AddPassword } from "@/components/add-password"
import { YourCards } from "@/components/your-cards"
import { YourPasswords } from "@/components/your-passwords"
import { Shield, Lock, CreditCard, Search } from "lucide-react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Secura - Secure Password Manager",
  description: "Securely store and manage your passwords and credit cards",
};

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Secura
            </h1>
          </div>
          <p className="text-3xl font-semibold mb-4">Your Ultimate Password Manager</p>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
            Securely store and manage your passwords and credit cards in one place
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Contact Developer</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-muted-foreground">Your data is encrypted and securely stored</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Password Manager</h3>
              <p className="text-muted-foreground">Store passwords and cards with one click</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cross-Device Access</h3>
              <p className="text-muted-foreground">Access your passwords and cards from any device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
