import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface GiftFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  storeFilter: string;
  onStoreFilterChange: (value: string) => void;
  stores: string[];
}

export function GiftFilters({
  nameFilter,
  onNameFilterChange,
  priceRange,
  onPriceRangeChange,
  storeFilter,
  onStoreFilterChange,
  stores,
}: GiftFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Buscar por nome</Label>
        <Input
          id="name"
          placeholder="Digite o nome do presente..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="store">Loja</Label>
        <Select value={storeFilter} onValueChange={onStoreFilterChange}>
          <SelectTrigger id="store">
            <SelectValue placeholder="Selecione uma loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as lojas</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store} value={store}>
                {store}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="price">Faixa de preço</Label>
        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger id="price">
            <SelectValue placeholder="Selecione uma faixa de preço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os preços</SelectItem>
            <SelectItem value="0-100">Até R$ 100</SelectItem>
            <SelectItem value="100-300">R$ 100 - R$ 300</SelectItem>
            <SelectItem value="300-500">R$ 300 - R$ 500</SelectItem>
            <SelectItem value="500-plus">Acima de R$ 500</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default GiftFilters;