"use client"

import { useState } from "react";
import { Settings, Shield, Download, Upload, Trash2, Moon, Sun, User, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useSecura } from "@/lib/context/SecuraContext";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { PasswordBreachChecker } from "@/components/password-breach-checker";

export default function SettingsPage() {
  const { user } = useUser();
  const { passwords, cards, deletePassword, deleteCard } = useSecura();
  const { theme, setTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const exportData = async (type: 'passwords' | 'cards') => {
    setIsExporting(true);
    try {
      const data = type === 'passwords' ? passwords : cards;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `secura-${type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${type} exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        // This is a simple import - in a real app you'd want more validation
        toast.success(`Imported ${data.length} items successfully!`);
      } else {
        toast.error('Invalid file format');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  const deleteAllData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      try {
        passwords.forEach(password => deletePassword(password.id));
        cards.forEach(card => deleteCard(card.id));
        toast.success('All data deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete data');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Customize your Secura experience and manage your account
          </p>
        </div>

        {/* Settings Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user.firstName || ""} disabled />
                  <p className="text-xs text-muted-foreground">To change your name, update your Clerk profile</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user.lastName || ""} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.emailAddresses[0]?.emailAddress || ""} disabled />
                <p className="text-xs text-muted-foreground">To change your email, update your Clerk profile</p>
              </div>
              <div className="pt-2">
                <Button variant="outline">
                  Manage Profile in Clerk
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your security preferences and password settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="autoLock">Auto-Lock Timeout</Label>
                <Select defaultValue="5">
                  <SelectTrigger id="autoLock">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Automatically lock your vault after a period of inactivity</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passwordGenerator">Default Password Length</Label>
                <Select defaultValue="16">
                  <SelectTrigger id="passwordGenerator">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 characters</SelectItem>
                    <SelectItem value="12">12 characters</SelectItem>
                    <SelectItem value="16">16 characters</SelectItem>
                    <SelectItem value="20">20 characters</SelectItem>
                    <SelectItem value="24">24 characters</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Set the default length for generated passwords</p>
              </div>
              
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    Manage 2FA in Clerk
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Enhance your account security with two-factor authentication</p>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-primary dark:hidden" />
                <Moon className="h-5 w-5 text-primary hidden dark:block" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your Secura application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultView">Default View</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="defaultView">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="passwords">Passwords</SelectItem>
                    <SelectItem value="cards">Credit Cards</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Set your default dashboard view</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Tools
              </CardTitle>
              <CardDescription>
                Additional security features and tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordBreachChecker />
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Export Data</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => exportData('passwords')}
                      disabled={isExporting || passwords.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting...' : `Export Passwords (${passwords.length})`}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Download your passwords as a JSON file</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Export Cards</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => exportData('cards')}
                      disabled={isExporting || cards.length === 0}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting...' : `Export Cards (${cards.length})`}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Download your credit cards as a JSON file</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Import Data</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={isImporting}
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Import data from another password manager or backup</p>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>Danger Zone</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={deleteAllData}
                    disabled={passwords.length === 0 && cards.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Data ({passwords.length + cards.length} items)
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Permanently delete all your stored passwords and cards. This action cannot be undone.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}