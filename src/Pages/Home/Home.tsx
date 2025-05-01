import { useState, useEffect, FormEvent } from 'react'
import styles from './Home.module.css'
import { BsSearch } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  market_cap: number;
  current_price: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap_rank: number;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

const Home = () => {
  const [input, setInput] = useState('');
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoins();
  }, [page]);

  async function fetchCoins() {
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar moedas');
      }

      const data: CoinProps[] = await response.json();

      const price = Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD'
      });

      const priceCompact = Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
      });

      const formatted = data.map((item) => ({
        ...item,
        formatedPrice: price.format(item.current_price),
        formatedMarket: priceCompact.format(item.market_cap),
        formatedVolume: priceCompact.format(item.total_volume)
      }));

      setCoins(prev => [...prev, ...formatted]);

    } catch (error) {
      setErrorMessage('Erro ao buscar moedas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === '') return;
    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    if (!isLoading) {
      setPage(prev => prev + 1);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Moeda</th>
            <th>Valor de mercado</th>
            <th>Preço</th>
            <th>Volume</th>
            <th>Mudança 24h</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label="Rank">{item.market_cap_rank}</td>
              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img className={styles.logo} src={item.image} alt="logo" />
                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol.toUpperCase()}
                  </Link>
                </div>
              </td>
              <td className={styles.tdLabel} data-label="Valor de mercado">{item.formatedMarket}</td>
              <td className={styles.tdLabel} data-label="Preço">{item.formatedPrice}</td>
              <td className={styles.tdLabel} data-label="Volume">{item.formatedVolume}</td>
              <td
                className={
                  item.price_change_percentage_24h > 0
                    ? styles.tdProfit
                    : styles.tdLoss
                }
                data-label="Mudança 24h"
              >
                <span>{item.price_change_percentage_24h.toFixed(2)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className={styles.buttonMore}
        onClick={handleGetMore}
        disabled={isLoading}
      >
        {isLoading ? 'Carregando...' : <FaPlus size={30} color="#FFF" />}
      </button>
    </main>
  );
};

export default Home;
