"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Lock, Eye, EyeOff, Trash2, Copy, Search, ExternalLink } from "lucide-react"
import { useSecura } from "@/lib/context/SecuraContext"
import toast from "react-hot-toast"

interface PasswordData {
  id: string
  siteName: string
  username: string
  password: string
  url?: string
  notes?: string
  createdAt: string
}

export function YourPasswords() {
  const { passwords, deletePassword } = useSecura()
  const [searchQuery, setSearchQuery] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())

  const togglePasswordVisibility = (passwordId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(passwordId)) {
        newSet.delete(passwordId)
      } else {
        newSet.add(passwordId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${itemName} copied to clipboard`)
  }

  const handleDelete = (passwordId: string) => {
    if (confirm("Are you sure you want to delete this password?")) {
      deletePassword(passwordId)
      toast.success("Password deleted successfully")
    }
  }

  const maskPassword = (password: string) => {
    return "*".repeat(password.length)
  }

  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    switch (score) {
      case 0:
      case 1:
        return { strength: "Very Weak", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" }
      case 2:
        return { strength: "Weak", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" }
      case 3:
        return { strength: "Fair", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" }
      case 4:
        return { strength: "Good", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" }
      case 5:
        return { strength: "Strong", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" }
      default:
        return { strength: "Unknown", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" }
    }
  }

  const filteredPasswords = passwords.filter(password =>
    password.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    password.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (password.url && password.url.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Your Passwords ({passwords.length})
        </CardTitle>
        <CardDescription>Manage your saved passwords</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search passwords..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredPasswords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{searchQuery ? "No passwords match your search" : "No passwords saved yet"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPasswords.map((item) => {
              const passwordStrength = getPasswordStrength(item.password)
              return (
                <Card key={item.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{item.siteName}</h3>
                        <Badge className={passwordStrength.color}>{passwordStrength.strength}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(item.id)}
                        >
                          {visiblePasswords.has(item.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Username:</span>
                        <div className="flex items-center gap-2">
                          <span>{item.username}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(item.username, "Username")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {visiblePasswords.has(item.id) ? item.password : maskPassword(item.password)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(item.password, "Password")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {item.url && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">URL:</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              {item.url} <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {item.notes && (
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground">Notes:</span>
                          <p className="mt-1 text-sm bg-muted/50 p-2 rounded">{item.notes}</p>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        Added on {new Date(item.createdAt).toLocaleDateString()}
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
