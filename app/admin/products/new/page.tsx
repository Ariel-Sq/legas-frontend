'use client';

import { useState } from 'react';
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
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type ProductTemplateFormData,
  type ProductVariationFormData,
  type ProductImageFormData,
  type ProductPriceTierFormData,
  createProductTemplate,
  createProductVariation,
  createProductImage,
  createProductPriceTier,
} from '@/lib/products-admin';

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [createdVariations, setCreatedVariations] = useState<
    Array<{ id: number; name: string; price: number; sku: string }>
  >([]);
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(
    null
  );

  // Step 1: Product Template
  const [templateData, setTemplateData] = useState<ProductTemplateFormData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    category_id: 1,
    brand: '',
    specifications: {},
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: true,
  });

  // Step 2: Product Variations
  const [variations, setVariations] = useState<
    Array<ProductVariationFormData & { tempId: number }>
  >([]);
  const [currentVariation, setCurrentVariation] =
    useState<ProductVariationFormData>({
      sku: '',
      name: '',
      price: 0,
      compare_at_price: 0,
      cost_price: 0,
      stock_quantity: 0,
      low_stock_threshold: 5,
      attributes: {},
      weight: 0,
      dimensions: {},
      is_active: true,
    });

  // Step 3: Product Images
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

  // Step 4: Price Tiers
  const [priceTiersByVariation, setPriceTiersByVariation] = useState<
    Record<number, Array<ProductPriceTierFormData & { tempId: number }>>
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
      compare_at_price: 0,
      cost_price: 0,
      stock_quantity: 0,
      low_stock_threshold: 5,
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

  const handleAddPriceTier = () => {
    if (!selectedVariationId) return;

    const currentTiers = priceTiersByVariation[selectedVariationId] || [];
    const newTier = { ...currentPriceTier, tempId: Date.now() };

    setPriceTiersByVariation({
      ...priceTiersByVariation,
      [selectedVariationId]: [...currentTiers, newTier],
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

  const handleRemovePriceTier = (tempId: number) => {
    if (!selectedVariationId) return;

    const currentTiers = priceTiersByVariation[selectedVariationId] || [];
    setPriceTiersByVariation({
      ...priceTiersByVariation,
      [selectedVariationId]: currentTiers.filter((pt) => pt.tempId !== tempId),
    });
  };

  const handleSubmitTemplate = async () => {
    try {
      const template = await createProductTemplate(templateData);
      setTemplateId(template.id);
      setStep(2);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleSubmitVariations = async () => {
    if (!templateId) return;

    try {
      const createdVars: Array<{
        id: number;
        name: string;
        price: number;
        sku: string;
      }> = [];

      for (const variation of variations) {
        const createdVariation = await createProductVariation(
          templateId,
          variation
        );
        createdVars.push({
          id: createdVariation.id,
          name: variation.name,
          price: variation.price,
          sku: variation.sku,
        });
      }

      setCreatedVariations(createdVars);
      // Select first variation by default
      if (createdVars.length > 0) {
        setSelectedVariationId(createdVars[0].id);
      }
      setStep(3);
    } catch (error) {
      console.error('Error creating variations:', error);
    }
  };

  const handleSubmitImages = async () => {
    if (createdVariations.length === 0) return;

    try {
      const firstVariationId = createdVariations[0].id;
      for (const image of images) {
        await createProductImage(firstVariationId, image);
      }
      setStep(4);
    } catch (error) {
      console.error('Error creating images:', error);
    }
  };

  const handleSubmitPriceTiers = async () => {
    try {
      for (const [variationId, tiers] of Object.entries(
        priceTiersByVariation
      )) {
        for (const priceTier of tiers) {
          await createProductPriceTier(Number(variationId), priceTier);
        }
      }
      router.push('/admin');
    } catch (error) {
      console.error('Error creating price tiers:', error);
    }
  };

  const currentVariationTiers = selectedVariationId
    ? priceTiersByVariation[selectedVariationId] || []
    : [];
  const selectedVariation = createdVariations.find(
    (v) => v.id === selectedVariationId
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Crear Producto</h1>
              <p className="text-muted-foreground">Paso {step} de 4</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>

          {/* Step 1: Product Template */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Producto</CardTitle>
                <CardDescription>
                  Datos básicos del template del producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={templateData.name}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Ej: Sofá Moderno"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={templateData.slug}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          slug: e.target.value,
                        })
                      }
                      placeholder="sofa-moderno"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Descripción Corta *</Label>
                  <Input
                    id="short_description"
                    value={templateData.short_description}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        short_description: e.target.value,
                      })
                    }
                    placeholder="Descripción breve del producto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Completa *</Label>
                  <Textarea
                    id="description"
                    value={templateData.description}
                    onChange={(e) =>
                      setTemplateData({
                        ...templateData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Descripción detallada del producto"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={templateData.category_id.toString()}
                      onValueChange={(value) =>
                        setTemplateData({
                          ...templateData,
                          category_id: Number.parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sofas</SelectItem>
                        <SelectItem value="2">Chairs</SelectItem>
                        <SelectItem value="3">Tables</SelectItem>
                        <SelectItem value="4">Beds</SelectItem>
                        <SelectItem value="5">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={templateData.brand}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          brand: e.target.value,
                        })
                      }
                      placeholder="Nombre de la marca"
                    />
                  </div>
                </div>

                {/* SEO Section */}
                <div className="border-t pt-6 space-y-6">
                  <h3 className="text-lg font-semibold">SEO (Opcional)</h3>

                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={templateData.meta_title}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          meta_title: e.target.value,
                        })
                      }
                      placeholder="Título para motores de búsqueda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={templateData.meta_description}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          meta_description: e.target.value,
                        })
                      }
                      placeholder="Descripción para motores de búsqueda"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                    <Input
                      id="meta_keywords"
                      value={templateData.meta_keywords}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          meta_keywords: e.target.value,
                        })
                      }
                      placeholder="palabras, clave, separadas, por, comas"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={templateData.is_active}
                    onCheckedChange={(checked) =>
                      setTemplateData({
                        ...templateData,
                        is_active: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="is_active">Producto activo</Label>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSubmitTemplate} size="lg">
                    Continuar a Variaciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Product Variations */}
          {step === 2 && (
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={currentVariation.price}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            price: Number.parseFloat(e.target.value),
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="compare_at_price">
                        Precio Comparación
                      </Label>
                      <Input
                        id="compare_at_price"
                        type="number"
                        value={currentVariation.compare_at_price}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            compare_at_price: Number.parseFloat(e.target.value),
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost_price">Precio de Costo</Label>
                      <Input
                        id="cost_price"
                        type="number"
                        value={currentVariation.cost_price}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            cost_price: Number.parseFloat(e.target.value),
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">
                        Cantidad en Stock *
                      </Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={currentVariation.stock_quantity}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            stock_quantity: Number.parseInt(e.target.value),
                          })
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="low_stock_threshold">
                        Umbral de Stock Bajo
                      </Label>
                      <Input
                        id="low_stock_threshold"
                        type="number"
                        value={currentVariation.low_stock_threshold}
                        onChange={(e) =>
                          setCurrentVariation({
                            ...currentVariation,
                            low_stock_threshold: Number.parseInt(
                              e.target.value
                            ),
                          })
                        }
                        placeholder="5"
                      />
                    </div>
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

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Volver
                </Button>
                <Button
                  onClick={handleSubmitVariations}
                  disabled={variations.length === 0}
                >
                  Continuar a Imágenes
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Product Images */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Imagen</CardTitle>
                  <CardDescription>
                    Sube imágenes del producto con información adicional
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

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Volver
                </Button>
                <Button
                  onClick={handleSubmitImages}
                  disabled={images.length === 0}
                >
                  Continuar a Precios por Cantidad
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Price Tiers */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Variación</CardTitle>
                  <CardDescription>
                    Elige la variación para configurar sus precios por cantidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Variación</Label>
                    <Select
                      value={selectedVariationId?.toString()}
                      onValueChange={(value) =>
                        setSelectedVariationId(Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una variación" />
                      </SelectTrigger>
                      <SelectContent>
                        {createdVariations.map((variation) => (
                          <SelectItem
                            key={variation.id}
                            value={variation.id.toString()}
                          >
                            {variation.name} - SKU: {variation.sku}
                            {priceTiersByVariation[variation.id]?.length >
                              0 && (
                              <Badge variant="secondary" className="ml-2">
                                {priceTiersByVariation[variation.id].length}{' '}
                                rangos
                              </Badge>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {selectedVariationId && selectedVariation && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Precios por Cantidad - {selectedVariation.name}
                      </CardTitle>
                      <CardDescription>
                        Define precios especiales según la cantidad comprada. El
                        precio por defecto aplica para cantidades menores al
                        primer rango.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <Label className="text-sm text-muted-foreground">
                          Precio por Defecto
                        </Label>
                        <p className="text-2xl font-bold">
                          ${selectedVariation.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aplica para cantidades de 1 a{' '}
                          {currentVariationTiers.length > 0
                            ? currentVariationTiers[0].min_quantity - 1
                            : '∞'}{' '}
                          unidades
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">
                          Agregar Rango de Precio
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="min_quantity">
                              Desde (cantidad) *
                            </Label>
                            <Input
                              id="min_quantity"
                              type="number"
                              min="1"
                              value={currentPriceTier.min_quantity}
                              onChange={(e) =>
                                setCurrentPriceTier({
                                  ...currentPriceTier,
                                  min_quantity: Number.parseInt(e.target.value),
                                })
                              }
                              placeholder="5"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="max_quantity">
                              Hasta (cantidad)
                            </Label>
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
                              Vacío = "{currentPriceTier.min_quantity} en
                              adelante"
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tier_price">
                              Precio por unidad *
                            </Label>
                            <Input
                              id="tier_price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={currentPriceTier.price}
                              onChange={(e) =>
                                setCurrentPriceTier({
                                  ...currentPriceTier,
                                  price: Number.parseFloat(e.target.value),
                                })
                              }
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button type="button" onClick={handleAddPriceTier}>
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Rango
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Price Tiers List */}
                  {currentVariationTiers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Rangos de Precio Configurados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
                            <div>
                              <p className="font-medium">
                                ${selectedVariation.price.toFixed(2)} por unidad
                              </p>
                              <p className="text-sm text-muted-foreground">
                                De 1 a{' '}
                                {currentVariationTiers[0].min_quantity - 1}{' '}
                                unidades
                              </p>
                            </div>
                            <Badge variant="secondary">
                              Precio por defecto
                            </Badge>
                          </div>

                          {currentVariationTiers.map((tier) => (
                            <div
                              key={tier.tempId}
                              className="flex items-center justify-between p-4 border border-border rounded-lg"
                            >
                              <div>
                                <p className="font-medium">
                                  ${tier.price.toFixed(2)} por unidad
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  De {tier.min_quantity}{' '}
                                  {tier.max_quantity
                                    ? `a ${tier.max_quantity}`
                                    : 'en adelante'}{' '}
                                  unidades
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemovePriceTier(tier.tempId)
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
                </>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Volver
                </Button>
                <Button onClick={handleSubmitPriceTiers}>
                  Finalizar y Crear Producto
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
