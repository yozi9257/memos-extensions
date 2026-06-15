import { createRoot } from "react-dom/client";
import { Toaster } from 'react-hot-toast';
import { StorageProvider } from './context/StorageContext';
import Setting from "./components/Setting";
import Editor from "./components/Editor";

import './styles/main.css';

// 检测是否以窗口模式打开
const getIsWindowMode = (): boolean => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'window';
};

// 检测是否以侧边栏模式打开
const getIsSidepanelMode = (): boolean => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'sidepanel';
};

const root = createRoot(document.getElementById('root') as HTMLElement);
const App = () => {
    const isWindowMode = getIsWindowMode();
    const isSidepanelMode = getIsSidepanelMode();

    // 窗口模式下给 body 添加 class
    if (isWindowMode) {
        document.body.classList.add('window-mode');
    }

    // 侧边栏模式下给 body 添加 class
    if (isSidepanelMode) {
        document.body.classList.add('sidepanel-mode');
    }

    return (
        <StorageProvider>
            <Toaster />
            <Setting isWindowMode={isWindowMode} isSidepanelMode={isSidepanelMode} />
            <Editor />
        </StorageProvider>
    );
};

root.render(<App />)
