import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, ErrorText } from '../../components/UI';
import { merchantService } from '@/lib/merchantService';
import { MerchantDTO } from '@/types/api';

export default function MerchantsPage() {
  const [list, setList] = useState<MerchantDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const nav = useNavigate();

  const loadMerchants = async (keyword?: string) => {
    try {
      setErr(null);
      setLoading(true);
      const data = await merchantService.listMerchants(keyword);
      setList(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load merchants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMerchants();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void loadMerchants(searchKeyword);
  };

  if (loading) return <Spinner />;
  if (err) return <ErrorText msg={err} />;

  return (
    <div>
      <h2 className="page-title">Merchants</h2>

      <form onSubmit={handleSearch} className="search-row">
        <input
          type="text"
          className="input search-input"
          placeholder="Search merchant by name"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
      </form>

      {list.length === 0 ? (
        <div className="muted">No merchants found.</div>
      ) : (
        <ul className="merchant-grid">
          {list.map((m) => (
            <li key={m.id} className="merchant-card" onClick={() => nav(`/user/merchants/${m.id}`)}>
              <div>
                <div className="merchant-title merchant-title-link">{m.name}</div>
                <div className="merchant-sub">{m.address || 'No address provided'}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
