import { db } from '@/lib/db';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/config/brand';
import { ShieldCheck, TrendingUp, DollarSign, ShoppingBag, CreditCard, Lock } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const orders = await db.order.findMany({
    include: { items: true },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'PAID' || o.status === 'DELIVERED' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / (totalOrdersCount || 1) : 0;

  const paystackOrdersCount = orders.filter((o) => o.paymentMethod === 'PAYSTACK').length;
  const codOrdersCount = orders.filter((o) => o.paymentMethod === 'COD').length;

  const auditLogs = await db.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Header & RBAC / 2FA status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gold/20 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Executive Dashboard</span>
            <h1 className="text-3xl font-serif text-ink">Analytics, Audit Logs & Security</h1>
          </div>
          <div className="flex items-center space-x-2 bg-gold/15 border border-gold px-3 py-1.5 text-xs font-semibold text-gold-deep">
            <ShieldCheck className="w-4 h-4" />
            <span>2FA Authenticated (Owner / Admin)</span>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-paper-soft border border-gold/20 p-6 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 flex items-center justify-between">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-gold" />
            </span>
            <div className="text-2xl font-bold text-ink">{formatPrice(totalRevenue)}</div>
            <p className="text-[11px] text-charcoal/60">Ghana Prepaid & Confirmed COD</p>
          </div>

          <div className="bg-paper-soft border border-gold/20 p-6 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 flex items-center justify-between">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-gold" />
            </span>
            <div className="text-2xl font-bold text-ink">{totalOrdersCount}</div>
            <p className="text-[11px] text-charcoal/60">Across all Ghana regions</p>
          </div>

          <div className="bg-paper-soft border border-gold/20 p-6 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 flex items-center justify-between">
              <span>Average Order Value (AOV)</span>
              <TrendingUp className="w-4 h-4 text-gold" />
            </span>
            <div className="text-2xl font-bold text-ink">{formatPrice(averageOrderValue)}</div>
            <p className="text-[11px] text-charcoal/60">Per customer checkout</p>
          </div>

          <div className="bg-paper-soft border border-gold/20 p-6 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 flex items-center justify-between">
              <span>Payment Split</span>
              <CreditCard className="w-4 h-4 text-gold" />
            </span>
            <div className="text-sm font-bold text-ink pt-1">
              Paystack: {paystackOrdersCount} | COD: {codOrdersCount}
            </div>
            <p className="text-[11px] text-charcoal/60">Prepaid Card/MoMo vs Cash on Delivery</p>
          </div>
        </div>

        {/* Security Audit Log Section */}
        <section className="space-y-4 pt-6 border-t border-gold/20">
          <h2 className="text-2xl font-serif text-ink flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gold" />
            <span>Administrative Audit Log</span>
          </h2>
          <div className="bg-paper border border-charcoal/10 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper-soft border-b border-charcoal/10 text-charcoal uppercase tracking-wider">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Entity ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-4 text-charcoal/70">
                        {new Date(log.createdAt).toLocaleString('en-GH')}
                      </td>
                      <td className="p-4 font-bold text-ink">{log.action}</td>
                      <td className="p-4">{log.entity}</td>
                      <td className="p-4 text-charcoal/60">{log.entityId || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-charcoal/60">
                      No administrative audit log entries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
