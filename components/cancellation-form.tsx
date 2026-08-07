'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2 } from 'lucide-react';
import { createCancellation } from '@/lib/cancellations';

/**
 * Botón de arrepentimiento (Resolución 424/2020): no registration may be
 * required, and the consumer must receive a trámite code — shown instantly
 * on success.
 */
export function CancellationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await createCancellation({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      // Only send if it looks like an order id (uuid); free text goes in message.
      orderId: /^[0-9a-f-]{36}$/i.test(form.orderId.trim())
        ? form.orderId.trim()
        : undefined,
      message:
        [
          form.message.trim(),
          form.orderId.trim() && !/^[0-9a-f-]{36}$/i.test(form.orderId.trim())
            ? `Referencia de pedido indicada: ${form.orderId.trim()}`
            : '',
        ]
          .filter(Boolean)
          .join('\n') || undefined,
    });
    setSubmitting(false);
    if (result.code) {
      setCode(result.code);
    } else {
      setError(result.error || 'No pudimos registrar tu solicitud.');
    }
  };

  if (code) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center space-y-4">
        <CheckCircle className="h-12 w-12 mx-auto text-primary" />
        <h2 className="text-2xl font-semibold">Solicitud registrada</h2>
        <p className="text-muted-foreground">
          Tu código de trámite es
        </p>
        <p className="text-3xl font-bold tracking-wider">{code}</p>
        <p className="text-sm text-muted-foreground">
          Guardalo como comprobante. Te vamos a contactar por email o WhatsApp
          para coordinar la cancelación y el reintegro, sin costo para vos.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">
          Nombre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          required
          placeholder="Tu nombre"
          className="mt-2"
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          required
          placeholder="tu@email.com"
          className="mt-2"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+54 9 11 ..."
          className="mt-2"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="orderId">Número de pedido</Label>
        <Input
          id="orderId"
          placeholder="Lo encontrás en Mis pedidos (opcional)"
          className="mt-2"
          value={form.orderId}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="message">Comentario</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Contanos qué compraste y por qué querés cancelar (opcional)"
          className="mt-2"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...
          </>
        ) : (
          'Solicitar cancelación'
        )}
      </Button>
    </form>
  );
}
