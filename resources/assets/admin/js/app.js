import { BrowserRouter } from 'react-router-dom';


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
        <ul>
            <li>item 1</li>
        </ul>
    </div>
);

const Main = () => (
    <Switch>
        <Route exact path='/admin/' component={Dashboard} />
        <Route exact path='/admin/films' component={FilmsList} />
        <Route path='/admin/films/:id' component={FilmShow} />
    </Switch>
);

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('app'));