import styles from './Header.module.css'
import logoimg from '../../assets/logo.svg'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className={styles.container}>
        <Link to='/'>
        <img src={logoimg} alt="Logo Cripto App" />
        </Link>
    </header>
  )
}

export default Header