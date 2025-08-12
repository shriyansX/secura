import { toast } from "react-hot-toast";

// Types for our data
export interface PasswordEntry {
  id: string;
  siteName: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: string;
}

export interface CardEntry {
  id: string;
  cardName: string;
  cardType: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  createdAt: string;
}

// Simple encryption/decryption functions
function encrypt(text: string, userId: string): string {
  // This is a simple XOR encryption - in a real app, use a proper encryption library
  const key = userId.split('').map(char => char.charCodeAt(0)).reduce((a, b) => a + b, 0);
  return text
    .split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) ^ key))
    .join('');
}

function decrypt(text: string, userId: string): string {
  // XOR encryption is symmetric, so we use the same function to decrypt
  return encrypt(text, userId);
}

// Storage service
export const storageService = {
  // Passwords
  getPasswords: (userId: string): PasswordEntry[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const encryptedData = localStorage.getItem(`secura_passwords_${userId}`);
      if (!encryptedData) return [];
      
      const decryptedData = decrypt(encryptedData, userId);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error getting passwords:', error);
      toast.error('Failed to load passwords');
      return [];
    }
  },
  
  savePassword: (password: Omit<PasswordEntry, 'id' | 'createdAt'>, userId: string): PasswordEntry => {
    try {
      const passwords = storageService.getPasswords(userId);
      
      const newPassword: PasswordEntry = {
        ...password,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedPasswords = [...passwords, newPassword];
      const encryptedData = encrypt(JSON.stringify(updatedPasswords), userId);
      
      localStorage.setItem(`secura_passwords_${userId}`, encryptedData);
      toast.success('Password saved successfully');
      
      return newPassword;
    } catch (error) {
      console.error('Error saving password:', error);
      toast.error('Failed to save password');
      throw error;
    }
  },
  
  updatePassword: (password: PasswordEntry, userId: string): PasswordEntry => {
    try {
      const passwords = storageService.getPasswords(userId);
      
      const updatedPasswords = passwords.map(p => 
        p.id === password.id ? password : p
      );
      
      const encryptedData = encrypt(JSON.stringify(updatedPasswords), userId);
      localStorage.setItem(`secura_passwords_${userId}`, encryptedData);
      
      toast.success('Password updated successfully');
      return password;
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
      throw error;
    }
  },
  
  deletePassword: (passwordId: string, userId: string): void => {
    try {
      const passwords = storageService.getPasswords(userId);
      
      const updatedPasswords = passwords.filter(p => p.id !== passwordId);
      
      const encryptedData = encrypt(JSON.stringify(updatedPasswords), userId);
      localStorage.setItem(`secura_passwords_${userId}`, encryptedData);
      
      toast.success('Password deleted successfully');
    } catch (error) {
      console.error('Error deleting password:', error);
      toast.error('Failed to delete password');
      throw error;
    }
  },
  
  // Cards
  getCards: (userId: string): CardEntry[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const encryptedData = localStorage.getItem(`secura_cards_${userId}`);
      if (!encryptedData) return [];
      
      const decryptedData = decrypt(encryptedData, userId);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error getting cards:', error);
      toast.error('Failed to load cards');
      return [];
    }
  },
  
  saveCard: (card: Omit<CardEntry, 'id' | 'createdAt'>, userId: string): CardEntry => {
    try {
      const cards = storageService.getCards(userId);
      
      const newCard: CardEntry = {
        ...card,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedCards = [...cards, newCard];
      const encryptedData = encrypt(JSON.stringify(updatedCards), userId);
      
      localStorage.setItem(`secura_cards_${userId}`, encryptedData);
      toast.success('Card saved successfully');
      
      return newCard;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
      throw error;
    }
  },
  
  updateCard: (card: CardEntry, userId: string): CardEntry => {
    try {
      const cards = storageService.getCards(userId);
      
      const updatedCards = cards.map(c => 
        c.id === card.id ? card : c
      );
      
      const encryptedData = encrypt(JSON.stringify(updatedCards), userId);
      localStorage.setItem(`secura_cards_${userId}`, encryptedData);
      
      toast.success('Card updated successfully');
      return card;
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
      throw error;
    }
  },
  
  deleteCard: (cardId: string, userId: string): void => {
    try {
      const cards = storageService.getCards(userId);
      
      const updatedCards = cards.filter(c => c.id !== cardId);
      
      const encryptedData = encrypt(JSON.stringify(updatedCards), userId);
      localStorage.setItem(`secura_cards_${userId}`, encryptedData);
      
      toast.success('Card deleted successfully');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
      throw error;
    }
  },
};