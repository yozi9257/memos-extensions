import { createRoot } from "react-dom/client";
import { Toaster } from 'react-hot-toast';
import { StorageProvider } from './context/StorageContext';
import Setting from "./components/Setting";
import Editor from "./components/Editor";

import './styles/main.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
const App = () => {
    return (
        <StorageProvider>
            <Toaster />
            <Setting />
            <Editor />
        </StorageProvider>
    );
};

root.render(<App />)
