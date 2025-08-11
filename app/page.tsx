import { AddCard } from "@/components/add-card"
import { AddPassword } from "@/components/add-password"
import { YourCards } from "@/components/your-cards"
import { YourPasswords } from "@/components/your-passwords"
import { Shield } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Secura - Home",
  description: "This is the homepage of my Password Manager",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Password Manager
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Securely store and manage your passwords and credit cards in one place
          </p>
        </div>

        {/* Add Forms Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <AddCard />
          </div>
          <div className="space-y-4">
            <AddPassword />
          </div>
        </div>

        {/* Saved Items Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <YourCards />
          </div>
          <div className="space-y-4">
            <YourPasswords />
          </div>
        </div>
      </div>
    </div>
  )
}
