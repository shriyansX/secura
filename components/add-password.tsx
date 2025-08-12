"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Key, Eye, EyeOff, Settings } from "lucide-react"
import { useSecura } from "@/lib/context/SecuraContext"
import toast from "react-hot-toast"
import { Progress } from "@/components/ui/progress"

export function AddPassword() {
  const { addPassword } = useSecura();
  const [formData, setFormData] = useState({
    siteName: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatorSettings, setGeneratorSettings] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      addPassword(formData)
      setFormData({
        siteName: "",
        username: "",
        password: "",
        url: "",
        notes: "",
      })
      toast.success("Password saved successfully!")
    } catch (error) {
      console.error("Error saving password:", error)
      toast.error("Failed to save password")
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    let chars = ""
    if (generatorSettings.includeUppercase) chars += uppercase
    if (generatorSettings.includeLowercase) chars += lowercase
    if (generatorSettings.includeNumbers) chars += numbers
    if (generatorSettings.includeSymbols) chars += symbols
    
    if (chars === "") {
      toast.error("Please select at least one character type")
      return
    }
    
    let password = ""
    for (let i = 0; i < generatorSettings.length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, password })
    setShowGenerator(false)
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "Empty", color: "bg-gray-200" }
    
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-emerald-500"]
    
    return {
      score: Math.min(score, 5),
      label: labels[Math.min(score, 5)],
      color: colors[Math.min(score, 5)]
    }
  }

  const strength = getPasswordStrength(formData.password)

  return (
    <Card className="w-full" id="add-password">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Add Password
        </CardTitle>
        <CardDescription>Store your login credentials securely</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              placeholder="Google, Facebook, etc."
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username/Email</Label>
            <Input
              id="username"
              placeholder="john@example.com"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="button" variant="outline" onClick={() => setShowGenerator(!showGenerator)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength:</span>
                  <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </span>
                </div>
                <Progress value={(strength.score / 5) * 100} className="h-2" />
              </div>
            )}
          </div>

          {/* Password Generator */}
          {showGenerator && (
            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Password Generator</Label>
                <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                  Generate
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Length: {generatorSettings.length}</Label>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={generatorSettings.length}
                    onChange={(e) => setGeneratorSettings({...generatorSettings, length: parseInt(e.target.value)})}
                    className="w-24"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={generatorSettings.includeUppercase}
                      onChange={(e) => setGeneratorSettings({...generatorSettings, includeUppercase: e.target.checked})}
                    />
                    <span className="text-sm">Uppercase (A-Z)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={generatorSettings.includeLowercase}
                      onChange={(e) => setGeneratorSettings({...generatorSettings, includeLowercase: e.target.checked})}
                    />
                    <span className="text-sm">Lowercase (a-z)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={generatorSettings.includeNumbers}
                      onChange={(e) => setGeneratorSettings({...generatorSettings, includeNumbers: e.target.checked})}
                    />
                    <span className="text-sm">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={generatorSettings.includeSymbols}
                      onChange={(e) => setGeneratorSettings({...generatorSettings, includeSymbols: e.target.checked})}
                    />
                    <span className="text-sm">Symbols (!@#$)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes here"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
