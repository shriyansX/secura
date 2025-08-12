"use client"

import { useState } from "react";
import { AddCard } from "@/components/add-card";
import { AddPassword } from "@/components/add-password";
import { YourCards } from "@/components/your-cards";
import { YourPasswords } from "@/components/your-passwords";
import { Shield, Search, Key, CreditCard, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSecura } from "@/lib/context/SecuraContext";

export default function Dashboard() {
  const { passwords, cards, searchPasswords, searchCards } = useSecura();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "passwords" | "cards">("all");

  const filteredPasswords = searchQuery ? searchPasswords(searchQuery) : passwords;
  const filteredCards = searchQuery ? searchCards(searchQuery) : cards;

  const totalItems = passwords.length + cards.length;
  const weakPasswords = passwords.filter(p => p.password.length < 8).length;
  const duplicatePasswords = passwords.filter(p => 
    passwords.filter(p2 => p2.password === p.password).length > 1
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Secure Vault
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Securely store and manage your passwords and credit cards in one place
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {passwords.length} passwords, {cards.length} cards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passwords</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passwords.length}</div>
              <p className="text-xs text-muted-foreground">
                {weakPasswords > 0 && `${weakPasswords} weak passwords`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cards.length}</div>
              <p className="text-xs text-muted-foreground">
                Securely stored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(0, 100 - (weakPasswords * 10) - (duplicatePasswords * 5))}%
              </div>
              <p className="text-xs text-muted-foreground">
                {weakPasswords > 0 && `${weakPasswords} weak passwords`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search passwords and cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All ({totalItems})
            </Button>
            <Button
              variant={activeTab === "passwords" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("passwords")}
            >
              Passwords ({passwords.length})
            </Button>
            <Button
              variant={activeTab === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("cards")}
            >
              Cards ({cards.length})
            </Button>
          </div>
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

        {/* Quick Actions */}
        {totalItems === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Welcome to Secura!</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first password or credit card to your secure vault.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => document.getElementById('add-password')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Key className="mr-2 h-4 w-4" />
                  Add Password
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('add-card')?.scrollIntoView({ behavior: 'smooth' })}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}