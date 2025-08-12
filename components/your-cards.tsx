"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreditCard, Eye, EyeOff, Trash2, Copy, Search } from "lucide-react"
import { useSecura } from "@/lib/context/SecuraContext"
import toast from "react-hot-toast"

interface CardData {
  id: string
  cardName: string
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardType: string
  createdAt: string
}

export function YourCards() {
  const { cards, deleteCard } = useSecura()
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())

  const toggleCardVisibility = (cardId: string) => {
    setVisibleCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${itemName} copied to clipboard`)
  }

  const handleDelete = (cardId: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCard(cardId)
      toast.success("Card deleted successfully")
    }
  }

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\d(?=\d{4})/g, "*")
  }

  const maskCVV = (cvv: string) => {
    return "*".repeat(cvv.length)
  }

  const getCardTypeColor = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "mastercard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "amex":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "discover":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const filteredCards = cards.filter(card =>
    card.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.cardholderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.cardType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Your Cards ({cards.length})
        </CardTitle>
        <CardDescription>Manage your saved credit cards</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{searchQuery ? "No cards match your search" : "No cards saved yet"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <Card key={card.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{card.cardName}</h3>
                      <Badge className={getCardTypeColor(card.cardType)}>{card.cardType.toUpperCase()}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardVisibility(card.id)}
                      >
                        {visibleCards.has(card.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cardholder:</span>
                      <span>{card.cardholderName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Card Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {visibleCards.has(card.id) ? card.cardNumber : maskCardNumber(card.cardNumber)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(card.cardNumber, "Card number")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expiry Date:</span>
                      <span>{card.expiryDate}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">CVV:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {visibleCards.has(card.id) ? card.cvv : maskCVV(card.cvv)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(card.cvv, "CVV")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      Added on {new Date(card.createdAt).toLocaleDateString()}
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
