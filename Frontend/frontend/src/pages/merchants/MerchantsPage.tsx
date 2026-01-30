import { useEffect, useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import { Spinner, ErrorText, Button } from '../../components/UI';
import { useCart } from '../../state/CartContext';
import { useNavigate } from 'react-router-dom';
import { merchantService } from '@/lib/merchantService';
import { MerchantDTO } from '@/types/api';

const SAMPLE_ITEM = { id: 'latte', name: 'Latte', price: 5.9 };

export default function MerchantsPage() {
  const [list, setList] = useState<MerchantDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { user } = useAuth();
  const cart = useCart();
  const nav = useNavigate();

  // 加载商家列表
  const loadMerchants = async (keyword?: string) => {
    try {
      setErr(null);
      setLoading(true);
      const data = await merchantService.listMerchants(keyword);
      setList(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || '加载商家失败');
      console.error('加载商家错误:', e);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载
  useEffect(() => {
    loadMerchants();
  }, []);
  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMerchants(searchKeyword);
  };

  function addToCart(m: MerchantDTO) {
    if (cart.merchantId && cart.merchantId !== m.id) cart.setMerchant(m.id);
    else if (!cart.merchantId) cart.setMerchant(m.id);
    cart.add(SAMPLE_ITEM, 1);
  }

  function goCheckout(m: MerchantDTO) {
    if (cart.merchantId !== m.id || cart.items.length === 0) return;
    nav('/user/checkout');
  }

  async function orderQuick(m: MerchantDTO) {
    try {
      if (!user?.id) throw new Error('Not logged in');
      // 使用新的订单服务 API
      const orderData = await import('@/lib/orderService').then(mod =>
        mod.orderService.createOrder(user.id, m.id, '快速订单')
      );
      alert(`订单已下单: ${m.name}`);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || '下单失败';
      setErr(msg);
    }
  }

  if (loading) return <Spinner />;
  if (err) return <ErrorText msg={err} />;

  return (
    <div>
      <h2 className="page-title">商家列表</h2>

      {/* 搜索框 */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="搜索商家名称..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            style={{
              padding: '8px',
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            搜索
          </button>
        </div>
      </form>

      {list.length === 0 ? (
        <div className="muted">没有商家</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((m) => (
            <li key={m.id} className="item">
              <div className="item-title">{m.name}</div>
              <div className="item-sub">{m.address || '无地址'}</div>
              {m.rating && <div className="item-sub">⭐ {m.rating.toFixed(1)}</div>}
              <div className="mt-3 flex gap-2">
                <Button onClick={() => addToCart(m)}>
                  加入购物车 ${SAMPLE_ITEM.price}
                </Button>
                <Button 
                  onClick={() => goCheckout(m)} 
                  disabled={cart.merchantId !== m.id || !cart.items.length}
                >
                  去结账
                </Button>
                <Button onClick={() => orderQuick(m)}>快速下单</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
