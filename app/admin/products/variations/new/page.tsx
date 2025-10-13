'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ProductTemplate, getProductTemplates } from '@/lib/products';
import {
  type ProductVariationFormData,
  type ProductImageFormData,
  type ProductPriceTierFormData,
  createProductVariation,
  createProductImage,
  createProductPriceTier,
} from '@/lib/products-admin';

export default function NewVariationPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Product Variations
  const [variations, setVariations] = useState<
    Array<ProductVariationFormData & { tempId: number }>
  >([]);
  const [currentVariation, setCurrentVariation] =
    useState<ProductVariationFormData>({
      sku: '',
      name: '',
      price: 0,
      stock_quantity: 0,
      attributes: {},
      weight: 0,
      dimensions: {},
      is_active: true,
    });

  // Product Images
  const [images, setImages] = useState<
    Array<ProductImageFormData & { tempId: number }>
  >([]);
  const [currentImage, setCurrentImage] = useState<ProductImageFormData>({
    image_url: '',
    alt_text: '',
    title: '',
    sort_order: 0,
    is_main: false,
  });

  // Price Tiers
  const [priceTiersByVariation, setPriceTiersByVariation] = useState<
    Record<string, Array<ProductPriceTierFormData & { tempId: number }>>
  >({});
  const [currentPriceTier, setCurrentPriceTier] =
    useState<ProductPriceTierFormData>({
      min_quantity: 1,
      max_quantity: undefined,
      price: 0,
    });

  // Attribute management
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await getProductTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []);

  const handleAddAttribute = () => {
    if (attributeKey && attributeValue) {
      setCurrentVariation({
        ...currentVariation,
        attributes: {
          ...currentVariation.attributes,
          [attributeKey]: attributeValue,
        },
      });
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...currentVariation.attributes };
    delete newAttributes[key];
    setCurrentVariation({ ...currentVariation, attributes: newAttributes });
  };

  const handleAddVariation = () => {
    setVariations([...variations, { ...currentVariation, tempId: Date.now() }]);
    setCurrentVariation({
      sku: '',
      name: '',
      price: 0,
      stock_quantity: 0,
      attributes: {},
      weight: 0,
      dimensions: {},
      is_active: true,
    });
  };

  const handleRemoveVariation = (tempId: number) => {
    setVariations(variations.filter((v) => v.tempId !== tempId));
  };

  const handleAddImage = () => {
    setImages([...images, { ...currentImage, tempId: Date.now() }]);
    setCurrentImage({
      image_url: '',
      alt_text: '',
      title: '',
      sort_order: images.length + 1,
      is_main: false,
    });
  };

  const handleRemoveImage = (tempId: number) => {
    setImages(images.filter((img) => img.tempId !== tempId));
  };

  const handleSetMainImage = (tempId: number) => {
    setImages(
      images.map((img) => ({ ...img, is_main: img.tempId === tempId }))
    );
  };

  const handleAddPriceTier = (variationId: string) => {
    const currentTiers = priceTiersByVariation[variationId] || [];
    const newTier = { ...currentPriceTier, tempId: Date.now() };

    setPriceTiersByVariation({
      ...priceTiersByVariation,
      [variationId]: [...currentTiers, newTier],
    });

    // Reset form with suggested next min_quantity
    setCurrentPriceTier({
      min_quantity:
        currentTiers.length > 0
          ? (currentTiers[currentTiers.length - 1].max_quantity || 0) + 1
          : 1,
      max_quantity: undefined,
      price: 0,
    });
  };

  const handleRemovePriceTier = (variationId: string, tempId: number) => {
    const currentTiers = priceTiersByVariation[variationId] || [];
    setPriceTiersByVariation({
      ...priceTiersByVariation,
      [variationId]: currentTiers.filter((pt) => pt.tempId !== tempId),
    });
  };

  const handleSubmitVariations = async () => {
    if (!selectedTemplateId) return;

    try {
      for (const variation of variations) {
        const createdVariation = await createProductVariation(
          selectedTemplateId,
          variation
        );

        // Create images for this variation
        for (const image of images) {
          await createProductImage(createdVariation.id, image);
        }

        // Create price tiers for this variation
        const tiers = priceTiersByVariation[createdVariation.id] || [];
        for (const priceTier of tiers) {
          await createProductPriceTier(createdVariation.id, priceTier);
        }
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating variations:', error);
    }
  };

  const selectedTemplate = templates.find(
    (t) => t.id.toString() === selectedTemplateId
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold mb-2">Crear Variaciones</h1>
                <p className="text-muted-foreground">
                  Selecciona un template y agrega variaciones
                </p>
              </div>
            </div>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/admin/products">
                <X className="h-4 w-4" />
                Cancelar
              </Link>
            </Button>
          </div>

          {/* Template Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Seleccionar Template</CardTitle>
              <CardDescription>
                Elige el template para el cual crearás variaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTemplates ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-sm text-muted-foreground">
                    Cargando templates...
                  </div>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                    No hay templates disponibles. Crea un template primero.
                  </p>
                  <Button asChild>
                    <Link href="/admin/products/new">Crear Template</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">Template *</Label>
                    <Select
                      value={selectedTemplateId}
                      onValueChange={setSelectedTemplateId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.id}
                            value={template.id.toString()}
                          >
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplate && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-medium mb-2">
                        Template Seleccionado:
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>Nombre:</strong> {selectedTemplate.name}
                        </p>
                        <p>
                          <strong>Descripción:</strong>{' '}
                          {selectedTemplate.description || 'Sin descripción'}
                        </p>
                        <p>
                          <strong>Estado:</strong>{' '}
                          {selectedTemplate.is_active ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variations Section */}
          {selectedTemplate && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Variación</CardTitle>
                  <CardDescription>
                    Define las variaciones del producto (tallas, colores, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={currentVariation.sku}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            sku: e.target.value,
                          })
                        }
                        placeholder="SOFA-001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variation_name">
                        Nombre de la Variación *
                      </Label>
                      <Input
                        id="variation_name"
                        value={currentVariation.name}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            name: e.target.value,
                          })
                        }
                        placeholder="Ej: Sofá Rojo - Talla M"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={currentVariation.price}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            price: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">
                        Cantidad en Stock *
                      </Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        min="0"
                        value={currentVariation.stock_quantity}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            stock_quantity:
                              Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={currentVariation.is_active}
                      onCheckedChange={(checked) =>
                        setCurrentVariation({
                          ...currentVariation,
                          is_active: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="is_active">Variación activa</Label>
                  </div>

                  {/* Attributes */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="text-lg font-semibold">
                      Atributos (Color, Talla, etc.)
                    </h3>

                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="attr_key">Atributo</Label>
                        <Input
                          id="attr_key"
                          value={attributeKey}
                          onChange={(e) => setAttributeKey(e.target.value)}
                          placeholder="color"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="attr_value">Valor</Label>
                        <Input
                          id="attr_value"
                          value={attributeValue}
                          onChange={(e) => setAttributeValue(e.target.value)}
                          placeholder="rojo"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          onClick={handleAddAttribute}
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {currentVariation.attributes &&
                      Object.keys(currentVariation.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(currentVariation.attributes).map(
                            ([key, value]) => (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="gap-2"
                              >
                                {key}: {value}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttribute(key)}
                                  className="hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleAddVariation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Variación
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Variations List */}
              {variations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Variaciones Agregadas ({variations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {variations.map((variation) => (
                        <div
                          key={variation.tempId}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{variation.name}</p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {variation.sku} • ${variation.price} • Stock:{' '}
                              {variation.stock_quantity}
                            </p>
                            {variation.attributes &&
                              Object.keys(variation.attributes).length > 0 && (
                                <div className="flex gap-2 mt-2">
                                  {Object.entries(variation.attributes).map(
                                    ([key, value]) => (
                                      <Badge key={key} variant="outline">
                                        {key}: {value}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveVariation(variation.tempId)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Product Images Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes del Producto</CardTitle>
                  <CardDescription>
                    Agrega imágenes para mostrar el producto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de la Imagen *</Label>
                    <Input
                      id="image_url"
                      value={currentImage.image_url}
                      onChange={(e) =>
                        setCurrentImage({
                          ...currentImage,
                          image_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Por ahora ingresa la URL. Próximamente: subida de archivos
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="alt_text">
                        Texto Alternativo (Alt Text)
                      </Label>
                      <Input
                        id="alt_text"
                        value={currentImage.alt_text}
                        onChange={(e) =>
                          setCurrentImage({
                            ...currentImage,
                            alt_text: e.target.value,
                          })
                        }
                        placeholder="Descripción de la imagen"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_title">Título de la Imagen</Label>
                      <Input
                        id="image_title"
                        value={currentImage.title}
                        onChange={(e) =>
                          setCurrentImage({
                            ...currentImage,
                            title: e.target.value,
                          })
                        }
                        placeholder="Título opcional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Orden de Visualización</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={currentImage.sort_order}
                      onChange={(e) =>
                        setCurrentImage({
                          ...currentImage,
                          sort_order: Number.parseInt(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_main"
                      checked={currentImage.is_main}
                      onCheckedChange={(checked) =>
                        setCurrentImage({
                          ...currentImage,
                          is_main: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="is_main">Imagen principal</Label>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleAddImage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Imagen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Images List */}
              {images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Imágenes Agregadas ({images.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div
                          key={image.tempId}
                          className="relative border border-border rounded-lg p-4 space-y-2"
                        >
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={image.image_url || '/placeholder.svg'}
                              alt={image.alt_text || 'Product image'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium truncate">
                              {image.title || 'Sin título'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {image.alt_text || 'Sin alt text'}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge
                                variant={image.is_main ? 'default' : 'outline'}
                              >
                                {image.is_main
                                  ? 'Principal'
                                  : `Orden: ${image.sort_order}`}
                              </Badge>
                              <div className="flex gap-2">
                                {!image.is_main && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleSetMainImage(image.tempId)
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveImage(image.tempId)
                                  }
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Price Tiers Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Precios por Cantidad (Opcional)</CardTitle>
                  <CardDescription>
                    Configura precios especiales para compras al por mayor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Agregar Rango de Precio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min_quantity">Desde (cantidad) *</Label>
                        <Input
                          id="min_quantity"
                          type="number"
                          min="1"
                          value={currentPriceTier.min_quantity}
                          onChange={(e) =>
                            setCurrentPriceTier({
                              ...currentPriceTier,
                              min_quantity:
                                Number.parseInt(e.target.value) || 1,
                            })
                          }
                          placeholder="5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max_quantity">Hasta (cantidad)</Label>
                        <Input
                          id="max_quantity"
                          type="number"
                          min={currentPriceTier.min_quantity}
                          value={currentPriceTier.max_quantity || ''}
                          onChange={(e) =>
                            setCurrentPriceTier({
                              ...currentPriceTier,
                              max_quantity: e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="Dejar vacío para 'en adelante'"
                        />
                        <p className="text-xs text-muted-foreground">
                          Vacío = "{currentPriceTier.min_quantity} en adelante"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tier_price">Precio por unidad *</Label>
                        <Input
                          id="tier_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentPriceTier.price}
                          onChange={(e) =>
                            setCurrentPriceTier({
                              ...currentPriceTier,
                              price: Number.parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() =>
                          variations.length > 0 &&
                          handleAddPriceTier(variations[0].tempId.toString())
                        }
                        disabled={variations.length === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Rango
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitVariations}
                  disabled={variations.length === 0}
                  size="lg"
                >
                  Crear Variaciones
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
