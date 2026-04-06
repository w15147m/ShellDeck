import { createRoot } from 'react-dom/client';
import Home from './pages/Home/Home';
import './index.css';

const App = () =>{
    return (
        <>
            <Home />
        </>
    )
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);
