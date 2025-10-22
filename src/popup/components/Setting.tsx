import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useChromeStorage } from '../context/StorageContext';
import { createMemosInstance, getUserId } from "../api/memos"

export default function Setting() {
    // 获取存储操作方法
    const { storage, setStorage, isInitialized } = useChromeStorage();
    // 状态管理
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [apiUrl, setApiUrl] = useState<string>('');
    const [apiToken, setApiToken] = useState<string>('');

    // 初始化：从存储中加载当前值到表单
    useEffect(() => {
        if (isInitialized) {
            setApiUrl(storage.apiUrl || '');
            setApiToken(storage.apiToken || '');
        }
    }, [isInitialized, storage.apiUrl, storage.apiToken]); // 仅依赖必要字段

    // 保存设置到chrome.storage.sync
    const handleSaveConfig = async () => {
        try {
            await setStorage({
                apiUrl,
                apiToken
            });
            setShowSetting(false);
            // 测试连接
            const memos = createMemosInstance(apiUrl, apiToken);
            const userId = await getUserId(memos);
            if (userId) {
                await setStorage({ userId });
                // (toast as any).success(`连接成功, 用户ID: ${userId}`);
            } else {
                (toast as any).error(chrome.i18n.getMessage("invalidToken"));
            }
        } catch (error) {
            console.error('保存失败', error);
            (toast as any).error(chrome.i18n.getMessage("invalidToken"));
        }
    };

    // 跳转到 memos实例页面
    const handleOpenSite = () => {
        // 输入框失去焦点后，保存当前输入框的值到chrome.storage.sync存储
        chrome.tabs.create({ url: apiUrl })
    }

    if (!isInitialized) {
        return <div>{chrome.i18n.getMessage("loading")}</div>;
    }

    return (
        <>
            <div className="title" id="opensite" onClick={handleOpenSite}>MEMOS</div>
            <div id="blog_info_edit">
                {/* 配置按钮 */}
                <button onClick={() => setShowSetting(!showSetting)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="icon" viewBox="0 0 1024 1024">
                        <path d="M914 432c-5-26-21-43-41-43h-4c-54 0-99-44-99-99 0-17 9-37 9-38 10-22 2-50-18-65l-103-57h-1c-21-9-49-4-64 12-12 12-50 44-79 44s-68-33-79-45a60 60 0 0 0-64-13l-106 58-2 1a54 54 0 0 0-18 65c0 1 9 21 9 38 0 55-45 99-99 99h-5c-19 0-35 17-40 43 0 2-9 45-9 80s9 79 9 81c5 25 21 42 41 42h4c54 0 99 45 99 99 0 18-9 37-9 38-10 23-2 51 18 65l101 56 1 1c21 9 49 3 65-13 14-15 52-47 80-47 30 0 69 35 81 48a58 58 0 0 0 64 14l104-58 2-1c20-14 28-42 18-65 0-1-9-20-9-38 0-54 45-99 99-99h5c19 0 35-17 40-42 0-2 9-46 9-81s-9-78-9-80m-51 80c0 23-5 52-7 64a158 158 0 0 0-134 215l-89 49c-4-5-17-18-35-31-31-23-61-35-88-35s-57 12-88 34c-17 13-30 26-34 31l-86-48a159 159 0 0 0-134-215c-2-12-7-41-7-64 0-22 5-51 7-64a157 157 0 0 0 134-214l91-50c4 4 17 17 35 29 30 22 59 33 86 33s55-11 85-32c18-13 31-25 35-29l88 49a159 159 0 0 0 134 214c2 13 7 42 7 64" />
                        <path d="M510 366a146 146 0 1 0 1 292 146 146 0 0 0-1-292m87 146a87 87 0 1 1-173-1 87 87 0 0 1 173 1" />
                    </svg>
                </button>
            </div>
            {/* 配置memos连接 */}
            <div id="blog_info" className="">
                {showSetting && (
                    <div className="memo-setting">
                        <input
                            id="apiUrl"
                            className="inputer"
                            name="apiUrl"
                            type="text"
                            maxLength={245}
                            placeholder={chrome.i18n.getMessage("placeApiUrl")}
                            required={true}
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                        />
                        <input
                            id="apiTokens"
                            className="inputer"
                            name="apiTokens"
                            type="text"
                            maxLength={245}
                            placeholder={chrome.i18n.getMessage("placeApiTokens")}
                            required={true}
                            value={apiToken}
                            onChange={(e) => setApiToken(e.target.value)}
                        />
                        <button id="saveKey" className="action-btn confirm-btn" onClick={handleSaveConfig}>{chrome.i18n.getMessage("saveBtn")}</button>
                    </div>
                )}
            </div>
        </>
    );
};

