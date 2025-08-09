"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Eye, EyeOff, Copy, Trash2, ExternalLink } from "lucide-react"
import { useState } from "react"

// Mock data - in a real app, this would come from your database
const mockPasswords = [
  {
    id: 1,
    siteName: "Google",
    username: "john@example.com",
    password: "MySecurePassword123!",
    url: "https://accounts.google.com",
    notes: "Main Google account",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    siteName: "GitHub",
    username: "johndoe",
    password: "GitHubPass456@",
    url: "https://github.com",
    notes: "Development account",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    siteName: "Netflix",
    username: "john.doe@email.com",
    password: "NetflixFun789#",
    url: "https://netflix.com",
    notes: "Family subscription",
    createdAt: "2024-01-05",
  },
]

export function YourPasswords() {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set())

  const togglePasswordVisibility = (passwordId: number) => {
    const newVisiblePasswords = new Set(visiblePasswords)
    if (newVisiblePasswords.has(passwordId)) {
      newVisiblePasswords.delete(passwordId)
    } else {
      newVisiblePasswords.add(passwordId)
    }
    setVisiblePasswords(newVisiblePasswords)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskPassword = (password: string) => {
    return "•".repeat(password.length)
  }

  const getPasswordStrength = (password: string) => {
    if (
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      return { strength: "Strong", color: "bg-green-100 text-green-800" }
    } else if (password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)) {
      return { strength: "Medium", color: "bg-yellow-100 text-yellow-800" }
    } else {
      return { strength: "Weak", color: "bg-red-100 text-red-800" }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Your Passwords ({mockPasswords.length})
        </CardTitle>
        <CardDescription>Manage your saved login credentials</CardDescription>
      </CardHeader>
      <CardContent>
        {mockPasswords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No passwords saved yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockPasswords.map((item) => {
              const passwordStrength = getPasswordStrength(item.password)
              return (
                <Card key={item.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold text-lg">{item.siteName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={passwordStrength.color}>{passwordStrength.strength}</Badge>
                            {item.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => window.open(item.url, "_blank")}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(item.id)}>
                          {visiblePasswords.has(item.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Username:</span>
                        <div className="flex items-center gap-2">
                          <span>{item.username}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.username)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {visiblePasswords.has(item.id) ? item.password : maskPassword(item.password)}
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.password)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.url && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">URL:</span>
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => window.open(item.url, "_blank")}
                          >
                            {item.url}
                          </span>
                        </div>
                      )}
                      {item.notes && (
                        <div className="flex justify-between items-start">
                          <span className="text-muted-foreground">Notes:</span>
                          <span className="text-right max-w-xs">{item.notes}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Created:</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
