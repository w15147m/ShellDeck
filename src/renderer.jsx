import { createRoot } from 'react-dom/client';
import StickyNotes from './pages/StickyNotes';
import StandaloneNote from './pages/StandaloneNote';
import './index.css';

const App = () =>{
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'standalone') {
        const noteId = urlParams.get('id');
        return <StandaloneNote noteId={noteId} />;
    }

    return (
        <>
            <StickyNotes />
        </>
    )
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);
