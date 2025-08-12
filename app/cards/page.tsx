import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AddCard } from "@/components/add-card";
import { YourCards } from "@/components/your-cards";
import { CreditCard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secura - Cards",
  description: "Manage your credit cards securely",
};

export default async function CardsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Card Manager
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Securely store and manage your credit cards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 md:sticky md:top-24 md:self-start">
            <AddCard />
          </div>
          <div className="space-y-4">
            <YourCards />
          </div>
        </div>
      </div>
    </div>
  );
}