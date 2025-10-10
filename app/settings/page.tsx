'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/language-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t.settings.title}
            </h1>
            <p className="text-muted-foreground">{t.settings.preferences}</p>
          </div>

          <div className="grid gap-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.theme}</CardTitle>
                <CardDescription>
                  Customize how Woodland looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">{t.settings.theme}</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="cursor-pointer">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light" className="cursor-pointer">
                        {t.settings.themeOptions.light}
                      </SelectItem>
                      <SelectItem value="dark" className="cursor-pointer">
                        {t.settings.themeOptions.dark}
                      </SelectItem>
                      <SelectItem value="system" className="cursor-pointer">
                        {t.settings.themeOptions.system}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode, or sync with your system
                    preferences
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.language}</CardTitle>
                <CardDescription>{t.settings.preferences}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t.settings.language}</Label>
                  <Select
                    value={locale}
                    onValueChange={(value) => setLocale(value as 'en' | 'es')}
                  >
                    <SelectTrigger id="language" className="cursor-pointer">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en" className="cursor-pointer">
                        {t.settings.languageOptions.en}
                      </SelectItem>
                      <SelectItem value="es" className="cursor-pointer">
                        {t.settings.languageOptions.es}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language for the interface
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  {t.settings.dangerZone}
                </CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    {t.settings.deleteAccountWarning}
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" className="cursor-pointer">
                  {t.settings.deleteAccount}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {/* TODO: Implement OAuth logout and account deletion flow */}
                  Account is managed through OAuth. Deletion will revoke all
                  access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
