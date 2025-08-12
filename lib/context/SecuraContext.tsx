"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

// Define types for our data
type PasswordData = {
  id: string;
  siteName: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: string;
};

type CardData = {
  id: string;
  cardName: string;
  cardType: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  createdAt: string;
};

type SecuraContextType = {
  passwords: PasswordData[];
  cards: CardData[];
  addPassword: (password: Omit<PasswordData, 'id' | 'createdAt'>) => void;
  updatePassword: (id: string, password: Partial<PasswordData>) => void;
  deletePassword: (id: string) => void;
  addCard: (card: Omit<CardData, 'id' | 'createdAt'>) => void;
  updateCard: (id: string, card: Partial<CardData>) => void;
  deleteCard: (id: string) => void;
  searchPasswords: (query: string) => PasswordData[];
  searchCards: (query: string) => CardData[];
};

const SecuraContext = createContext<SecuraContextType | null>(null);

// Simple encryption/decryption functions
const encrypt = (text: string): string => {
  // In a real app, use a proper encryption library
  return btoa(unescape(encodeURIComponent(text))); // Handle Unicode characters
};

const decrypt = (encryptedText: string): string => {
  // In a real app, use a proper decryption library
  try {
    return decodeURIComponent(escape(atob(encryptedText))); // Handle Unicode characters
  } catch (error) {
    console.error('Error decrypting data:', error);
    return ''; // Return empty string if decryption fails
  }
};

export const SecuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded: clerkLoaded } = useUser();
  const userId = user?.id || 'anonymous';
  
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isClient, setIsClient] = useState(false);
  // Indicates whether we have finished loading data for the **current** user
  const [dataLoaded, setDataLoaded] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load data from Clerk privateMetadata or localStorage whenever the user changes
  useEffect(() => {
    if (clerkLoaded && isClient) {
      let loadedPasswords: PasswordData[] = [];
      let loadedCards: CardData[] = [];

      // First try to load from Clerk private metadata
      if (user) {
        try {
          const pm = user?.privateMetadata as Record<string, any> | undefined;
          const metaPasswords = pm?.secura_passwords as string | undefined;
          const metaCards = pm?.secura_cards as string | undefined;

          if (metaPasswords) {
            const decrypted = decrypt(metaPasswords);
            if (decrypted) {
              loadedPasswords = JSON.parse(decrypted);
            }
          }
          if (metaCards) {
            const decrypted = decrypt(metaCards);
            if (decrypted) {
              loadedCards = JSON.parse(decrypted);
            }
          }
        } catch (e) {
          console.error('Failed to parse Clerk metadata', e);
        }
      }

      // If no data from Clerk, try localStorage as fallback
      if (loadedPasswords.length === 0 && loadedCards.length === 0 && typeof window !== 'undefined') {
        try {
          const storedPasswords = localStorage.getItem(`secura_passwords_${userId}`);
          const storedCards = localStorage.getItem(`secura_cards_${userId}`);
          
          if (storedPasswords) {
            const decryptedPasswords = decrypt(storedPasswords);
            if (decryptedPasswords) {
              loadedPasswords = JSON.parse(decryptedPasswords);
            }
          }
          
          if (storedCards) {
            const decryptedCards = decrypt(storedCards);
            if (decryptedCards) {
              loadedCards = JSON.parse(decryptedCards);
            }
          }
        } catch (error) {
          console.error('Error loading data from localStorage:', error);
          // Clear corrupted data
          localStorage.removeItem(`secura_passwords_${userId}`);
          localStorage.removeItem(`secura_cards_${userId}`);
        }
      }

      // Set the loaded data
      setPasswords(loadedPasswords);
      setCards(loadedCards);
      setDataLoaded(true);
    }
  }, [userId, isClient, clerkLoaded, user]);

  // Save data to localStorage and Clerk metadata whenever it changes
  useEffect(() => {
    if (isClient && dataLoaded && typeof window !== 'undefined') {
      try {
        const encryptedPasswords = encrypt(JSON.stringify(passwords));
        
        // Always save to localStorage
        if (passwords.length > 0) {
          localStorage.setItem(`secura_passwords_${userId}`, encryptedPasswords);
        } else {
          localStorage.removeItem(`secura_passwords_${userId}`);
        }
        
        // Also persist to Clerk private metadata via backend if user is logged in
        if (clerkLoaded && user) {
          fetch("/api/save-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              passwords: passwords.length > 0 ? encryptedPasswords : null,
            }),
          }).catch(console.error);
        }
      } catch (error) {
        console.error('Error saving passwords:', error);
      }
    }
  }, [passwords, userId, isClient, dataLoaded, clerkLoaded, user]);

  useEffect(() => {
    if (isClient && dataLoaded && typeof window !== 'undefined') {
      try {
        const encryptedCards = encrypt(JSON.stringify(cards));
        
        // Always save to localStorage
        if (cards.length > 0) {
          localStorage.setItem(`secura_cards_${userId}`, encryptedCards);
        } else {
          localStorage.removeItem(`secura_cards_${userId}`);
        }
        
        // Also persist to Clerk private metadata via backend if user is logged in
        if (clerkLoaded && user) {
          fetch("/api/save-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              cards: cards.length > 0 ? encryptedCards : null,
            }),
          }).catch(console.error);
        }
      } catch (error) {
        console.error('Error saving cards:', error);
      }
    }
  }, [cards, userId, isClient, dataLoaded, clerkLoaded, user]);

  // Password CRUD operations
  const addPassword = (password: Omit<PasswordData, 'id' | 'createdAt'>) => {
    const newPassword: PasswordData = {
      ...password,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPasswords([...passwords, newPassword]);
  };

  const updatePassword = (id: string, updatedPassword: Partial<PasswordData>) => {
    setPasswords(passwords.map(password => 
      password.id === id ? { ...password, ...updatedPassword } : password
    ));
  };

  const deletePassword = (id: string) => {
    setPasswords(passwords.filter(password => password.id !== id));
  };

  // Card CRUD operations
  const addCard = (card: Omit<CardData, 'id' | 'createdAt'>) => {
    const newCard: CardData = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id: string, updatedCard: Partial<CardData>) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, ...updatedCard } : card
    ));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  // Search functionality
  const searchPasswords = (query: string): PasswordData[] => {
    const lowerCaseQuery = query.toLowerCase();
    return passwords.filter(password => 
      password.siteName.toLowerCase().includes(lowerCaseQuery) ||
      password.username.toLowerCase().includes(lowerCaseQuery) ||
      password.url.toLowerCase().includes(lowerCaseQuery) ||
      password.notes.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const searchCards = (query: string): CardData[] => {
    const lowerCaseQuery = query.toLowerCase();
    return cards.filter(card => 
      card.cardName.toLowerCase().includes(lowerCaseQuery) ||
      card.cardholderName.toLowerCase().includes(lowerCaseQuery) ||
      card.cardType.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <SecuraContext.Provider value={{
      passwords,
      cards,
      addPassword,
      updatePassword,
      deletePassword,
      addCard,
      updateCard,
      deleteCard,
      searchPasswords,
      searchCards,
    }}>
      {children}
    </SecuraContext.Provider>
  );
};

export const useSecura = () => {
  const context = useContext(SecuraContext);
  if (!context) {
    throw new Error('useSecura must be used within a SecuraProvider');
  }
  return context;
};