"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Eye, EyeOff, Copy, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data - in a real app, this would come from your database
const mockCards = [
  {
    id: 1,
    cardName: "Main Credit Card",
    cardType: "visa",
    cardholderName: "John Doe",
    cardNumber: "4532 1234 5678 9012",
    expiryDate: "12/25",
    cvv: "123",
  },
  {
    id: 2,
    cardName: "Business Card",
    cardType: "mastercard",
    cardholderName: "John Doe",
    cardNumber: "5555 4444 3333 2222",
    expiryDate: "08/26",
    cvv: "456",
  },
]

export function YourCards() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  const toggleCardVisibility = (cardId: number) => {
    const newVisibleCards = new Set(visibleCards)
    if (newVisibleCards.has(cardId)) {
      newVisibleCards.delete(cardId)
    } else {
      newVisibleCards.add(cardId)
    }
    setVisibleCards(newVisibleCards)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\d(?=\d{4})/g, "*")
  }

  const getCardTypeColor = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return "bg-blue-100 text-blue-800"
      case "mastercard":
        return "bg-red-100 text-red-800"
      case "amex":
        return "bg-green-100 text-green-800"
      case "discover":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Your Cards ({mockCards.length})
        </CardTitle>
        <CardDescription>Manage your saved credit cards</CardDescription>
      </CardHeader>
      <CardContent>
        {mockCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No cards saved yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockCards.map((card) => (
              <Card key={card.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{card.cardName}</h3>
                      <Badge className={getCardTypeColor(card.cardType)}>{card.cardType.toUpperCase()}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleCardVisibility(card.id)}>
                        {visibleCards.has(card.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cardholder:</span>
                      <span>{card.cardholderName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Card Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {visibleCards.has(card.id) ? card.cardNumber : maskCardNumber(card.cardNumber)}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(card.cardNumber)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Expiry:</span>
                      <span className="font-mono">{card.expiryDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CVV:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{visibleCards.has(card.id) ? card.cvv : "***"}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(card.cvv)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
