import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';


const App = () => (
    <div>
        <Header />
        <SideBar />
        <Main />
    </div>
);

const Header = () => (<div><h1>Header</h1></div>);

const SideBar = () => (
    <div>
        left nav
        <nav>
            <ul>
                <li>
                    <Link to='/admin/'>Dashboard</Link>
                </li>
                <li>
                    <Link to='/admin/films'>Films</Link>                
                </li>
                <li>
                    <Link to={{ pathname: '/admin/films/7' }}>Film 7</Link>                
                </li>
            </ul>
        </nav>
    </div>
);

const Dashboard = () => (
    <h1>Dashboard</h1>
);

const List = () => (
    <h1>List</h1>
);

const Show = (props) => (
    <h1>Show {`${props.match.params.id}`}</h1>
);

const Films = () => (
    <div>
        <h2>Films</h2>
        <Switch>
            <Route exact path='/admin/films' component={List} />
            <Route path='/admin/films/:id' component={Show} />
        </Switch>
    </div>
);

const Main = () => (
    <Switch>
        <Route exact path='/admin/' component={Dashboard} />
        <Route path='/admin/films' component={Films} />
    </Switch>
);

render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('app'));