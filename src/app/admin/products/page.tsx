import { db } from '@/lib/db';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/config/brand';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gold/20 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Admin Portal</span>
            <h1 className="text-3xl font-serif text-ink">Catalog & Inventory Management</h1>
          </div>
          <Button>+ Add New Fragrance</Button>
        </div>

        {/* Content Review & Legal Checklist Banner */}
        <div className="p-4 bg-paper-soft border border-gold/30 text-xs text-charcoal space-y-1">
          <p className="font-bold text-gold uppercase tracking-wider">Legal & Content Review Checklist</p>
          <p>• Avoid third-party brand names or trademarked fragrance titles.</p>
          <p>• Verify scent notes, gender classification, and size variant stock before publishing.</p>
        </div>

        {/* Product Catalog Table */}
        <div className="bg-paper border border-charcoal/10 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-paper-soft border-b border-charcoal/10 text-charcoal uppercase tracking-wider">
                <th className="p-4">Product Name</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Category</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Lowest Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {products.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                const lowestPrice = p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : 0;

                return (
                  <tr key={p.id} className="hover:bg-paper-soft/50">
                    <td className="p-4 font-semibold text-ink">
                      <div>{p.name}</div>
                      <span className="text-[10px] text-charcoal/50">{p.slug}</span>
                    </td>
                    <td className="p-4 uppercase">{p.gender}</td>
                    <td className="p-4">{p.category?.name || 'Unassigned'}</td>
                    <td className="p-4">
                      {totalStock <= 5 ? (
                        <Badge variant="alert">{totalStock} Left (Low Stock)</Badge>
                      ) : (
                        <span className="font-bold">{totalStock} units</span>
                      )}
                    </td>
                    <td className="p-4 font-bold">{formatPrice(lowestPrice)}</td>
                    <td className="p-4">
                      <Badge variant={p.isPublished ? 'gold' : 'dark'}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="p-4 space-x-2">
                      <button className="text-gold font-bold hover:underline">Edit</button>
                      <button className="text-alert-red font-bold hover:underline">Stock Adjust</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
