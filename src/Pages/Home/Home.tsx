import { useState, FormEvent, useEffect } from 'react'
import styles from './Home.module.css'
import { BsSearch } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

export interface CoinProps{
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string
  maxSupply: string
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string,
  formatedPrice?: string,
  formatedMarket?: string,
  formatedVolume?:string
}

interface DataProps{
  data: CoinProps[]
}


const Home = () => {
  const [input, setInput] = useState('');
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffeset] = useState(0);
  // useNavigate
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    getData();
  }, [offset])

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=0${offset}`)
    .then(response => response.json())
    .then((data: DataProps)=> {
      const coinsData = data.data;

      const price = Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD'
      })

      const priceCompact = Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
      })

      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        }
        return formated;
      })
      const listCoins = [...coins, ...formatedResult]

      setCoins(listCoins);
    })
  }

  function handleSubmit(e: FormEvent){
    e.preventDefault();

    if(input === '') return;
    navigate(`/detail/${input}`)
  }

  function handleGetMore(){
    if(offset === 0){
      setOffeset(10);
      return;
    }
    setOffeset(offset + 10)
  }

  return (
    <main className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder='Digite o nome da moeda...'
            value={input}
            onChange={(e) => setInput (e.target.value)}
            />
            <button type='submit'>
              <BsSearch size={30} color='#FFF'/>
            </button>
        </form>

        <table>
          <thead>
            <tr>
              <th scope='col'>Rank</th>
              <th scope='col'>Moeda</th>
              <th scope='col'>Valor de mercado</th>
              <th scope='col'>Preço</th>
              <th scope='col'>Volume</th>
              <th scope='col'>Mudança 24h</th>
            </tr>
          </thead>

          <tbody id='tbody'>
            {coins.length > 0 && coins.map((item) => (
              <tr className={styles.tr} key={item.id}>

              <td className={styles.tdLabel} data-label="Rank">
                {item.rank}
              </td>

              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img className={styles.logo}
                  src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`}
                  alt="Logo Cripto" />
                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>

              <td className={styles.tdLabel} data-label="Valor de mercado">
                {item.formatedMarket}
              </td>

              <td className={styles.tdLabel} data-label="Preço">
                {item.formatedPrice}
              </td>

              <td className={styles.tdLabel} data-label="Volume">
                {item.formatedVolume}
              </td>

              <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
              </td>
            </tr>
            ))}
          </tbody>
        </table>

        <button className={styles.buttonMore} onClick={handleGetMore}>
          <FaPlus size={30} color='#FFF'/>
        </button>






        
    </main>
  )
}

export default Home