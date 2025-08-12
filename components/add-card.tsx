"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSecura } from "@/lib/context/SecuraContext"
import toast from "react-hot-toast"

const formSchema = z.object({
  cardNumber: z.string().min(16, {
    message: "Card number must be at least 16 digits.",
  })
    .max(19, {
      message: "Card number cannot exceed 19 digits.",
    })
    .regex(/^\d+$/, {
      message: "Card number must contain only digits.",
    }),

  expiryDate: z.string().regex(/^([0-1][0-9]|[1-2])\/\d{2}$/, {
    message: "Expiry date must be in MM/YY format.",
  }),

  cvv: z.string().min(3, {
    message: "CVV must be at least 3 digits.",
  })
    .max(4, {
      message: "CVV cannot exceed 4 digits.",
    })
    .regex(/^\d+$/, {
      message: "CVV must contain only digits.",
    })
});


export function AddCard() {
  const { addCard } = useSecura();
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cardType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation - ignore spaces or dashes in card number
    const sanitizedNumber = formData.cardNumber.replace(/[^\d]/g, "");
    if (!sanitizedNumber.match(/^\d{15,19}$/)) {
      toast.error("Please enter a valid card number (15-19 digits)");
      return;
    }
    
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return;
    }
    
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      toast.error("Please enter a valid CVV (3-4 digits)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save sanitized number
      addCard({ ...formData, cardNumber: sanitizedNumber });
      setFormData({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        cardType: "",
      });
      toast.success("Card saved successfully!");
    } catch (error) {
      console.error("Error saving card:", error);
      toast.error("Failed to save card");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };

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
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setFormData({ ...formData, cardNumber: formatted });
              }}
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
                onChange={(e) => {
                  const formatted = formatExpiryDate(e.target.value);
                  setFormData({ ...formData, expiryDate: formatted });
                }}
                required
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                type="password"
                value={formData.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, cvv: value });
                }}
                required
                maxLength={4}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Card"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
