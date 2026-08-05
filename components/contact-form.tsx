'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

/**
 * Contact form that opens WhatsApp with the composed message — WhatsApp is
 * the store's real contact channel (there is no email inbox), and the old
 * form was decorative: it had no action and just reloaded the page.
 */
const WHATSAPP_NUMBER = '5491173666370';

export function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola Legas! Soy ${name.trim() || '...'}. ${message.trim()}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener'
    );
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          placeholder="Tu nombre"
          className="mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          placeholder="Contanos más sobre tu consulta..."
          rows={6}
          className="mt-2"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        <MessageCircle className="h-5 w-5 mr-2" />
        Enviar por WhatsApp
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Se abre WhatsApp con tu mensaje listo para enviar.
      </p>
    </form>
  );
}
