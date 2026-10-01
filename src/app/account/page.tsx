'use client';

import React, { useState } from 'react';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { TrustStrip } from '@/components/layout/TrustStrip';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/config/brand';
import { User, Package, MapPin, Heart, Clock, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'recent'>('orders');

  const mockOrders = [
    {
      id: 'ord-01',
      orderNumber: 'VAL-890123',
      date: '2026-09-28',
      total: 1450,
      status: 'DELIVERED',
      paymentMethod: 'PAYSTACK',
      items: [
        { name: 'Akoben Oud', size: '100ml', quantity: 1, price: 1450 },
      ],
    },
    {
      id: 'ord-02',
      orderNumber: 'VAL-890124',
      date: '2026-10-01',
      total: 720,
      status: 'PROCESSING',
      paymentMethod: 'COD',
      items: [
        { name: 'Sika Sunset', size: '50ml', quantity: 1, price: 720 },
      ],
    },
  ];

  const mockAddresses = [
    {
      id: 'addr-01',
      title: 'Home (Accra)',
      name: 'Kofi Mensah',
      region: 'Greater Accra',
      city: 'East Legon',
      landmark: 'Near ANC Mall, Senchi Street',
      gps: 'GA-183-9020',
      phone: '+233 24 123 4567',
      isDefault: true,
    },
  ];

  const mockWishlist = [
    {
      id: '1',
      slug: 'sol-de-accra',
      name: 'Sol de Accra',
      price: 650,
      imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      slug: 'asante-monarch',
      name: 'Asante Monarch',
      price: 890,
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />
      <TrustStrip />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-8">
        {/* Account Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gold/20 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gold/15 border border-gold rounded-full flex items-center justify-center text-gold font-bold text-xl">
              KM
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Client Portal</span>
              <h1 className="text-2xl md:text-3xl font-serif text-ink">Kofi Mensah</h1>
              <p className="text-xs text-charcoal/60">kofi@example.com • Member since 2026</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="flex items-center space-x-2 self-start md:self-auto">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-charcoal/10 pb-2">
          {[
            { id: 'orders', label: 'Order History & Status', icon: Package },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart },
            { id: 'recent', label: 'Recently Viewed', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-gold text-white border border-gold'
                    : 'bg-paper-soft text-charcoal hover:border-gold border border-charcoal/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl text-ink">Your Fragrance Orders</h2>
            <div className="space-y-4">
              {mockOrders.map((ord) => (
                <div key={ord.id} className="bg-paper border border-charcoal/10 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal/10 gap-2">
                    <div>
                      <span className="text-xs font-bold text-gold">Order #{ord.orderNumber}</span>
                      <p className="text-xs text-charcoal/60">Placed on {ord.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={ord.status === 'DELIVERED' ? 'gold' : 'dark'}>
                        {ord.status}
                      </Badge>
                      <span className="text-sm font-bold text-ink">{formatPrice(ord.total)}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-charcoal/10 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="py-2 flex justify-between">
                        <span>{it.name} ({it.size}) × {it.quantity}</span>
                        <span className="font-semibold">{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link href={`/track?orderNumber=${ord.orderNumber}`}>
                      <Button variant="outline" size="sm">
                        Track Live Fulfilment
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-ink">Address Book</h2>
              <Button size="sm">+ Add New Address</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAddresses.map((addr) => (
                <div key={addr.id} className="bg-paper-soft border border-gold/20 p-6 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink text-sm">{addr.title}</span>
                    {addr.isDefault && <Badge variant="gold" size="sm">Default</Badge>}
                  </div>
                  <p className="text-charcoal font-semibold">{addr.name}</p>
                  <p className="text-charcoal/80">{addr.city}, {addr.region}</p>
                  <p className="text-charcoal/70">{addr.landmark}</p>
                  <p className="text-charcoal/70">GPS: {addr.gps}</p>
                  <p className="text-charcoal/80 pt-1">{addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl text-ink">Saved Fragrances</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mockWishlist.map((item) => (
                <div key={item.id} className="bg-paper border border-charcoal/10 p-4 text-center space-y-2">
                  <div className="aspect-square bg-paper-soft overflow-hidden p-4">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-ink">{item.name}</h4>
                  <p className="text-xs font-bold text-ink">{formatPrice(item.price)}</p>
                  <Link href={`/products/${item.slug}`}>
                    <Button size="sm" variant="outline" className="w-full text-[10px]">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl text-ink">Recently Viewed</h2>
            <p className="text-xs text-charcoal/70">Fragrances you have explored during this session.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
