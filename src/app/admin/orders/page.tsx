import { db } from '@/lib/db';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/config/brand';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      items: { include: { product: true, variant: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const deliveryZones = await db.deliveryZone.findMany();

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Order Management Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gold/20">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Admin Portal</span>
              <h1 className="text-3xl font-serif text-ink">Order Management & Fulfilment</h1>
            </div>
            <Button size="sm">Export Orders CSV</Button>
          </div>

          <div className="bg-paper border border-charcoal/10 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper-soft border-b border-charcoal/10 text-charcoal uppercase tracking-wider">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Region</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-paper-soft/50">
                    <td className="p-4 font-bold text-gold">{ord.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-ink">{ord.customerName}</div>
                      <div className="text-[10px] text-charcoal/60">{ord.customerPhone}</div>
                    </td>
                    <td className="p-4">{ord.region}</td>
                    <td className="p-4 font-bold">{formatPrice(ord.total)}</td>
                    <td className="p-4 uppercase font-semibold">{ord.paymentMethod}</td>
                    <td className="p-4">
                      <Badge variant="gold">{ord.status}</Badge>
                    </td>
                    <td className="p-4 space-x-2">
                      <button className="text-gold font-bold hover:underline">Update Status</button>
                      <button className="text-alert-red font-bold hover:underline">Process Refund</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Delivery Zones Configuration Section */}
        <section className="space-y-6 pt-6 border-t border-gold/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-ink">Delivery Zones & Rates</h2>
            <Button size="sm" variant="outline">+ Add Delivery Zone</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryZones.map((zone) => (
              <div key={zone.id} className="bg-paper-soft border border-gold/20 p-6 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-serif font-bold text-base text-ink">{zone.name}</span>
                  <span className="font-bold text-gold">{formatPrice(zone.fee)} Fee</span>
                </div>
                <p className="text-charcoal/80"><strong>Regions Covered:</strong> {zone.regions}</p>
                <p className="text-charcoal/70">
                  Free Shipping Threshold: {zone.minOrderForFree ? formatPrice(zone.minOrderForFree) : 'None'}
                </p>
                <p className="text-charcoal/70">
                  COD Allowed: {zone.codAllowed ? `Yes (Cap: GHS ${zone.maxCodValue || 'Unlimited'})` : 'No'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
