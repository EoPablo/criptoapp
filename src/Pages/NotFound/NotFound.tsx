import styles from './notfound.module.css';
import Error from '../../assets/error.png';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <img className={styles.img} src={Error} alt="Imagem de erro" />
        <h1 className={styles.center}>Opss... Parece que essa página não existe!</h1>
        <a className={styles.btn}>
          <Link to='/'>
            Home
          </Link>
        </a>
    </div>
  )
}

export default NotFound