import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from '@/components/profile-form';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session?.user || !userId) {
    redirect('/');
  }

  const user = session.user as typeof session.user & {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };

  const composedName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.name ||
    '';
  const initials = composedName
    ? composedName
        .split(' ')
        .map((n: string) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Mi Perfil
            </h1>
            <p className="text-muted-foreground">
              Administrá la información de tu cuenta
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>Tu foto de perfil</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  {user.image && (
                    <AvatarImage src={user.image} alt={composedName} />
                  )}
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{composedName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            <ProfileForm
              userId={userId}
              initial={{
                name: composedName,
                email: user.email ?? '',
                phoneNumber: user.phoneNumber ?? '',
                address: user.address ?? '',
                city: user.city ?? '',
                zipCode: user.zipCode ?? '',
                country: user.country ?? '',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
