import {Navbar, Nav, NavDropdown, Form, FormControl, Button, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import {useState} from 'react';
import { useHistory } from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import InfoIcon from '@mui/icons-material/Info';

function NavigationBar() {
    /*
        Adds navigation on top and bottom of the screen
    */
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((store) => store.user);
    const cart = useSelector((store) => store.cartReducer)
    const favorites = useSelector((store) => store.favoriteReducer)
    const [searchTerm, setSearchTerm] = useState('');

    const search = (event) => {
        // prevent from default
        event.preventDefault()
        dispatch({
            type: 'SEARCH',
            payload: searchTerm
        })
        history.push('/search');
    }

    return (
        <>
        {/* top bar has search and GG */}
        <Navbar bg="light" expand="lg" sticky="top">
        <LinkContainer to="/home">
            <Navbar.Brand>GroceryGuru</Navbar.Brand>
          </LinkContainer>

            <Nav className='m-auto'>
            <Form className="d-flex" onSubmit={search}> 
              {/* search bar that brings us to the search page on submission */}
              <FormControl
                type="search"
                placeholder="Search"
                className="mr-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(event) => {setSearchTerm(event.target.value)}}
              />
              <IconButton type="submit" variant="outline-success"><SearchIcon /></IconButton>
            </Form>
            </Nav>
        </Navbar>

        {/* bottom has the links */}
            <div style={{bottom: "0", position: "fixed", width: "100%", background: "white", height: "125"}}>
            <Nav fixed="bottom" fill justify variant="tabs">
              {/* if nobody is logged in, we should redirect to login/register view */}
              <Nav.Item>
              <LinkContainer to="/favorites" style={{color: "grey"}}>
                <Nav.Link>{favorites.length > 0 ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />} </Nav.Link>
              </LinkContainer>
              </Nav.Item>

                {/* if nobody is logged in, we should redirect to login/register view */}
              <Nav.Item>
              <LinkContainer to="/search" style={{color: "grey"}}>
                <Nav.Link><SearchIcon /> </Nav.Link>
              </LinkContainer>
              </Nav.Item>

              {/* if nobody is logged in, we should redirect to login/register view */}
              <Nav.Item>
              <LinkContainer to="/cart" style={{color: "grey"}}>
                <Nav.Link>{cart.length > 0 ? <ShoppingCartIcon /> : <ShoppingCartOutlinedIcon />} </Nav.Link>
              </LinkContainer>
              </Nav.Item>

              <Nav.Item>
              <NavDropdown title={<SettingsIcon />} id="nav-dropdown" style={{color: "grey"}}>
                <NavDropdown.Item eventKey="4.1">
                <LinkContainer to="/search" style={{color: "grey"}}>
                  <Nav.Link onClick={() => dispatch({ type: 'LOGOUT' })}><DirectionsRunIcon /> Logout</Nav.Link>
                </LinkContainer>
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="4.2">
                <LinkContainer to="/about" style={{color: "grey"}}>
                  <Nav.Link><InfoIcon /> About</Nav.Link>
                </LinkContainer>
                </NavDropdown.Item>
              </NavDropdown>
              </Nav.Item>
              </Nav>
              </div>
        </>
    );
}

export default NavigationBar