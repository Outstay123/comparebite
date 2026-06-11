'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ImagePlus,
  Loader2,
  Plus,
  PlusCircle,
  Save,
  X,
  XCircle,
} from 'lucide-react';
import locationsData from '@/lib/data/locations.json';
import { Location, Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ProductType = Product['product_type'];

type FormState = {
  location_id: string;
  seller_name: string;
  chain: string;
  name: string;
  description: string;
  categories: string[];
  categoryInput: string;
  product_type: ProductType;
  price: string;
  currency: string;
  ingredients: string[];
  ingredientInput: string;
  image_url: string;
  is_halal: boolean;
  is_vegetarian: boolean;
  allergens: string[];
  allergenInput: string;
};

const locations = locationsData as Location[];

const initialState: FormState = {
  location_id: locations[0]?.id || '',
  seller_name: locations[0]?.name || '',
  chain: locations[0]?.chain || '',
  name: '',
  description: '',
  categories: [],
  categoryInput: '',
  product_type: 'food',
  price: '',
  currency: 'MYR',
  ingredients: [],
  ingredientInput: '',
  image_url: '',
  is_halal: false,
  is_vegetarian: false,
  allergens: [],
  allergenInput: '',
};

type ListFieldProps = {
  label: string;
  placeholder: string;
  items: string[];
  value: string;
  required?: boolean;
  onValueChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

function ListField({
  label,
  placeholder,
  items,
  value,
  required = false,
  onValueChange,
  onAdd,
  onRemove,
}: ListFieldProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-primary-600"> *</span>}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Button type="button" variant="outline" onClick={onAdd} className="gap-2 sm:w-auto">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-full text-gray-500 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddFoodPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === form.location_id),
    [form.location_id]
  );

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addListItem = (
    listKey: 'categories' | 'ingredients' | 'allergens',
    inputKey: 'categoryInput' | 'ingredientInput' | 'allergenInput'
  ) => {
    const value = form[inputKey].trim();
    if (!value) return;

    setForm((current) => ({
      ...current,
      [listKey]: current[listKey].includes(value) ? current[listKey] : [...current[listKey], value],
      [inputKey]: '',
    }));
  };

  const removeListItem = (listKey: 'categories' | 'ingredients' | 'allergens', index: number) => {
    setForm((current) => ({
      ...current,
      [listKey]: current[listKey].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleLocationChange = (locationId: string) => {
    const location = locations.find((item) => item.id === locationId);
    setForm((current) => ({
      ...current,
      location_id: locationId,
      seller_name: location?.name || '',
      chain: location?.chain || '',
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';

    const imageData = new FormData();
    imageData.append('image', imageFile);

    const response = await fetch('/api/product-images', {
      method: 'POST',
      body: imageData,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Unable to upload image.');
    }

    return result.image_url;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saving');
    setMessage('');

    try {
      const uploadedImageUrl = await uploadImage();
      const payload = {
        ...form,
        image_url: uploadedImageUrl || form.image_url,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to add food item.');
      }

      setStatus('saved');
      router.push(`/product/${result.product.id}`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to add food item.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm mb-2">
                <PlusCircle className="w-4 h-4" />
                Consumer submission
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Add a Food Item</h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Submit a menu item with pricing, scores, dietary tags, and product details. Approved
                submissions are written directly into the local products database.
              </p>
            </div>
            <Link href="/search" className="hidden md:inline-flex text-sm font-medium text-primary-600 hover:text-primary-700">
              Browse products
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller and Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Seller location
                <select
                  value={form.location_id}
                  onChange={(event) => handleLocationChange(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input label="Food item name" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
              <label className="block text-sm font-medium text-gray-700">
                Price
                <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                  <span className="inline-flex items-center rounded-l-lg bg-gray-100 px-3 text-sm font-medium text-gray-700">
                    RM
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    className="w-full rounded-r-lg border-0 px-4 py-2 focus:outline-none"
                    required
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Product type
                <select
                  value={form.product_type}
                  onChange={(event) => updateField('product_type', event.target.value as ProductType)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="food">Food</option>
                  <option value="drink">Drink</option>
                  <option value="dessert">Dessert</option>
                  <option value="side">Side</option>
                </select>
              </label>
              <label className="md:col-span-2 block text-sm font-medium text-gray-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  className="mt-1 w-full min-h-24 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </label>
              <ListField
                label="Categories"
                placeholder="nasi_lemak"
                items={form.categories}
                value={form.categoryInput}
                required
                onValueChange={(value) => updateField('categoryInput', value)}
                onAdd={() => addListItem('categories', 'categoryInput')}
                onRemove={(index) => removeListItem('categories', index)}
              />
              <ListField
                label="Ingredients"
                placeholder="rice"
                items={form.ingredients}
                value={form.ingredientInput}
                required
                onValueChange={(value) => updateField('ingredientInput', value)}
                onAdd={() => addListItem('ingredients', 'ingredientInput')}
                onRemove={(index) => removeListItem('ingredients', index)}
              />
              <ListField
                label="Allergens"
                placeholder="gluten"
                items={form.allergens}
                value={form.allergenInput}
                onValueChange={(value) => updateField('allergenInput', value)}
                onAdd={() => addListItem('allergens', 'allergenInput')}
                onRemove={(index) => removeListItem('allergens', index)}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Food image</label>
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
                  <ImagePlus className="mb-2 h-7 w-7 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {imageFile ? imageFile.name : 'Upload an image from your device'}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">JPG, PNG, GIF, or WebP up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Selected food preview"
                    className="mt-3 h-40 w-full rounded-lg object-cover sm:w-64"
                  />
                )}
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={form.is_halal} onChange={(event) => updateField('is_halal', event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  Halal
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={form.is_vegetarian} onChange={(event) => updateField('is_vegetarian', event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  Vegetarian
                </label>
              </div>
            </div>
            {selectedLocation && (
              <p className="mt-4 text-sm text-gray-500">
                Selected seller: {selectedLocation.name}, {selectedLocation.address}
              </p>
            )}
          </div>

          {message && (
            <div
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
                'border-primary-300 bg-primary-50 text-primary-700'
              }`}
            >
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Button type="submit" size="lg" disabled={status === 'saving'} className="gap-2">
              {status === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Food Item
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
