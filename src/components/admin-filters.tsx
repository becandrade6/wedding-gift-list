import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AdminFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  storeFilter: string;
  onStoreFilterChange: (value: string) => void;
  stores: string[];
  showStatusFilter?: boolean;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  showBuyerFilter?: boolean;
  buyerFilter?: string;
  onBuyerFilterChange?: (value: string) => void;
}

export function AdminFilters({
  nameFilter,
  onNameFilterChange,
  priceRange,
  onPriceRangeChange,
  storeFilter,
  onStoreFilterChange,
  stores,
  showStatusFilter = false,
  statusFilter = 'all',
  onStatusFilterChange,
  showBuyerFilter = false,
  buyerFilter = '',
  onBuyerFilterChange
}: AdminFiltersProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Buscar por presente</Label>
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
        {showStatusFilter && onStatusFilterChange && (
          <div className="grid gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="purchased">Comprado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {showBuyerFilter && onBuyerFilterChange && (
          <div className="grid gap-1.5">
            <Label htmlFor="buyer">Buscar por comprador</Label>
            <Input
              id="buyer"
              placeholder="Digite o nome do comprador..."
              value={buyerFilter}
              onChange={(e) => onBuyerFilterChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFilters;