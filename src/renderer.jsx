import { createRoot } from 'react-dom/client';
import Home from './pages/Home/Home';
import './index.css';

import { Toaster } from 'react-hot-toast';

const App = () =>{
    return (
        <>
            <Home />
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
              }}
            />
        </>
    )
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);
