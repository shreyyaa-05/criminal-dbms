import '../navbar/navbar.css';
import img from '../images/logo.jpg'


function Navbar() {
  return (
    <>

      <div className='navbar'>

        <div className="navnamenlogo">

        <a href='/'><img src={img} alt="" className="logoimg" href="/" /></a>
          <h3 className='Name'><a className="navbari" href='/'>WikiCrime</a></h3>
        </div>

        <ul className="navul">
          <li className='navbarli'><a className="navbari" href="/">Home</a></li>
          <li className='navbarli'><a className="navbari" href="/search" >DashBoard</a></li>
          <li className='navbarli'><a className="navbari" href="/news">News</a></li>
          <li className='navbarli'><a className="navbari" href="/crimemap">Maps</a></li>
          
        </ul>
      </div>

    </>
  );
}

export default Navbar;