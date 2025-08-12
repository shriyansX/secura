"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export function PasswordBreachChecker() {
  const [password, setPassword] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{
    breached: boolean
    count: number
    message: string
  } | null>(null)

  const checkPassword = async () => {
    if (!password) {
      toast.error("Please enter a password to check")
      return
    }

    setIsChecking(true)
    setResult(null)

    try {
      // Create SHA-1 hash of the password
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-1', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      const prefix = hashHex.substring(0, 5)
      const suffix = hashHex.substring(5).toUpperCase()

      // Use HaveIBeenPwned API (k-anonymity approach)
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
      const text = await response.text()
      
      const hashes = text.split('\r\n')
      const found = hashes.find(hash => hash.startsWith(suffix))
      
      if (found) {
        const count = parseInt(found.split(':')[1])
        setResult({
          breached: true,
          count,
          message: `This password has been found ${count.toLocaleString()} times in data breaches.`
        })
        toast.error("Password has been compromised!")
      } else {
        setResult({
          breached: false,
          count: 0,
          message: "This password has not been found in any known data breaches."
        })
        toast.success("Password is safe!")
      }
    } catch (error) {
      console.error('Error checking password:', error)
      toast.error("Failed to check password")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Breach Checker
        </CardTitle>
        <CardDescription>
          Check if your password has been compromised in data breaches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="checkPassword">Password to Check</Label>
          <div className="flex gap-2">
            <Input
              id="checkPassword"
              type="password"
              placeholder="Enter password to check"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              onClick={checkPassword} 
              disabled={isChecking || !password}
              variant="outline"
            >
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Check"
              )}
            </Button>
          </div>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.breached 
              ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
              : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
          }`}>
            <div className="flex items-center gap-2">
              {result.breached ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium">
                {result.breached ? "Compromised" : "Safe"}
              </span>
            </div>
            <p className="text-sm mt-1">{result.message}</p>
            {result.breached && result.count > 0 && (
              <p className="text-xs text-red-600 mt-1">
                Recommendation: Change this password immediately and use a unique, strong password.
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>This tool uses the HaveIBeenPwned API to check if your password has been compromised.</p>
          <p>Your password is never sent to our servers - only a SHA-1 hash prefix is used for the check.</p>
        </div>
      </CardContent>
    </Card>
  )
}
