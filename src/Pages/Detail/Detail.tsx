import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './detail.module.css';

interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
  image: {
    large: string;
  };
}

const Detail = () => {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cripto}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes');
        }

        const data: CoinDetail = await response.json();

        setCoin(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    }

    getCoin();
  }, [cripto]);

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    );
  }

  const price = Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD'
  });

  const priceCompact = Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    notation: 'compact'
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin.name}</h1>
      <h1 className={styles.center}>{coin.symbol.toUpperCase()}</h1>

      <section className={styles.content}>
        <img
          src={coin.image.large}
          alt={`Logo da ${coin.name}`}
          className={styles.logo}
        />

        <h1>{coin.name} | {coin.symbol.toUpperCase()}</h1>

        <p><strong>Preço: </strong>{price.format(coin.market_data.current_price.usd)}</p>

        <a>
          <strong>Mercado: </strong>{priceCompact.format(coin.market_data.market_cap.usd)}
        </a>

        <a>
          <strong>Volume: </strong>{priceCompact.format(coin.market_data.total_volume.usd)}
        </a>

        <a>
          <strong>Mudança 24h: </strong>
          <span className={coin.market_data.price_change_percentage_24h > 0 ? styles.profit : styles.loss}>
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </a>
      </section>
    </div>
  );
};

export default Detail;
