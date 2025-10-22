import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { chromeStorage } from './chromeStorage';
import type { StorageData } from './chromeStorage';

// 定义 Context 类型（包含数据和操作方法）
interface StorageContextType {
    storage: Partial<StorageData>;
    setStorage: (data: Partial<StorageData>) => Promise<void>;
    removeStorage: (key: keyof StorageData) => Promise<void>;
    isInitialized: boolean; // 标记是否已初始化完成
}

// 创建 Context
const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Provider 组件：管理存储数据并广播变化（仅在这里做一次存储数据初始化）
export const StorageProvider = ({ children }: { children: ReactNode }) => {
    const [storage, setStorageState] = useState<Partial<StorageData>>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // 全局初始化：仅在 Provider 挂载时执行一次
    useEffect(() => {
        const initStorage = async () => {
            const data = await chromeStorage.get();
            setStorageState(data);
            setIsInitialized(true);
        };
        initStorage();
    }, []);

    // 监听存储变化，同步到本地状态
    useEffect(() => {
        const handleChange = (changes: { [K in keyof StorageData]?: chrome.storage.StorageChange }) => {
            // 合并变化到当前状态
            setStorageState(prev => ({
                ...prev,
                ...Object.fromEntries(
                    Object.entries(changes).map(([key, change]) => [key, change.newValue])
                )
            }));
        };

        chromeStorage.onChanged(handleChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleChange);
        };
    }, []);

    // 封装 set 方法：更新存储并触发 UI 刷新
    const setStorage = async (data: Partial<StorageData>) => {
        await chromeStorage.set(data);
        // 这里不需要手动更新状态，因为 onChanged 会触发更新
    };

    // 封装 remove 方法
    const removeStorage = async (key: keyof StorageData) => {
        await chromeStorage.remove(key);
    };

    return (
        <StorageContext.Provider value={{ storage, setStorage, removeStorage, isInitialized }}>
            {children}
        </StorageContext.Provider>
    );
};

// 自定义 Hook：简化组件中获取存储的方式
export const useChromeStorage = () => {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error('useChromeStorage must be used within a StorageProvider');
    }
    return context;
};
