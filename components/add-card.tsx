"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus } from "lucide-react"

export function AddCard() {
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cardType: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Card data:", formData)
    // Here you would typically save to your backend/database
    setFormData({
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      cardType: "",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Add Credit Card
        </CardTitle>
        <CardDescription>Securely store your credit card information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Card Name</Label>
            <Input
              id="cardName"
              placeholder="My Main Card"
              value={formData.cardName}
              onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardType">Card Type</Label>
            <Select value={formData.cardType} onValueChange={(value) => setFormData({ ...formData, cardType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="discover">Discover</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
