import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

import { createMemosInstance, createAttachment, Attachment } from "../api/memos";
import { useChromeStorage } from '../context/StorageContext';

// 定义Toolbar的props类型
interface ToolbarProps {
    onAdd: () => void;
}

export function Todo({ onClick }: any) {
    const handleClick = () => {
        onClick("- [ ] ");
    }
    return (
        <div id="newtodo" className="mr-5" onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="icon" viewBox="0 0 1024 1024">
                <path fill="#666" d="M407 365a41 41 0 0 0-59 0 41 41 0 0 0 0 60l149 149c9 8 19 13 30 13s21-5 30-13l341-341c17-18 17-43 0-60s-43-17-60 0L527 484 407 365z" />
                <path fill="#666" d="M868 416c-23 0-45 19-45 45v277c0 2 0 7-2 9 0 2-2 4-4 6s-4 4-6 4l-9 2H247c-2 0-6 0-8-2-2 0-4-2-6-4-3-2-5-4-5-6l-2-9V183l2-8c0-2 2-4 5-6 2-3 4-5 6-5l8-2h278c23 0 45-19 45-45s-20-44-45-44H247c-14 0-27 2-42 8a144 144 0 0 0-55 60c-7 13-9 28-9 42v555c0 15 2 28 8 43a122 122 0 0 0 58 58c13 6 28 8 43 8h554a108 108 0 0 0 77-32c11-11 17-21 24-34 6-13 8-28 8-43V461c-2-26-21-45-45-45z" />
            </svg>
        </div>
    );
};

export function GetLink({ onClick }: any) {
    const handleClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (tab) {
                let i_linkHtml = " [" + tab.title + "](" + tab.url + ") "
                if (tab.url) {
                    console.log(i_linkHtml);
                    onClick(i_linkHtml);
                } else {
                    (toast as any).error(chrome.i18n.getMessage("getLinkFailed"));
                }
            } else {
                (toast as any).error(chrome.i18n.getMessage("getLinkFailed"));
            }
        });
    }

    return (
        <div id="getlink" className="mr-5" onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="icon" viewBox="0 0 1024 1024">
                <path fill="#666" d="m600 697-1 1-94 76a198 198 0 0 1-280-30c-69-85-56-211 30-280l99-81-46-57-99 81a273 273 0 0 0 143 483 279 279 0 0 0 29 1c63 0 122-21 171-61l95-76-46-56-1-1zm256-464a273 273 0 0 0-383-40l-91 73 47 58 90-74a199 199 0 1 1 250 310l-96 77-1 1 46 57 97-78c56-46 92-111 99-184 9-72-12-143-58-200z" />
                <path fill="#666" d="m388 668 306-255 1-1-48-56-305 255h-2z" />
            </svg>
        </div>
    );
};

// 类型谓词函数：判断一个值是否为"非空对象"（排除空对象{}）
function isNotEmptyObject(obj: unknown): obj is object {
    // 先判断是否为对象（且不是null，因为typeof null会返回'object'）
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    // 再判断是否有自有可枚举属性（空对象{}的keys长度为0）
    return Object.keys(obj).length > 0;
}

export function Upload() {
    const { storage, setStorage, isInitialized } = useChromeStorage();
    const accept = "*/*";
    const multiple = true;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 触发文件选择对话框
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    // 处理文件选择
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            return;
        }

        try {
            // 1. 批量上传所有文件，收集结果（使用Promise.all确保全部完成）
            const uploadPromises = Array.from(files).map(file => uploadFile(file));
            const newAttachments = await Promise.all(uploadPromises); // 等待所有文件上传完成
            // 去除可能存在的空{}
            const filteredNewAttachments = newAttachments.filter(isNotEmptyObject);
            // 2. 合并现有附件和新附件（一次性合并）
            const existingAttachments = storage.attachments || [];
            const updatedAttachments = [...existingAttachments, ...filteredNewAttachments];

            // 3. 一次性更新存储（避免多次异步更新冲突）
            await setStorage({ attachments: updatedAttachments });

        } catch (error) {
            console.error("文件上传失败", error);
        } finally {
            // 重置input值
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };


    // 上传单个文件（返回上传结果）
    const uploadFile = async (file: File): Promise<Attachment> => {
        const memos = createMemosInstance(storage.apiUrl, storage.apiToken);
        const resAtt = await createAttachment(memos, file);
        return resAtt; // 返回上传后的附件信息
    };

    // 全局未初始化时不渲染实际内容
    if (!isInitialized) {
        return <div>{chrome.i18n.getMessage("loading")}</div>;
    }

    return (
        <div id="upres" className="mr-5" onClick={handleButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="icon" viewBox="0 0 1024 1024">
                <path fill="#555" d="M752 80H272c-70 0-128 58-128 128v608c0 70 58 128 128 128h354c33 0 65-13 91-37l126-126c24-24 37-56 37-91V208c0-70-58-128-128-128zM208 816V208c0-35 29-64 64-64h480c35 0 64 29 64 64v464h-96c-70 0-128 58-128 128v80H272c-35 0-64-29-64-64zm462 45c-4 5-9 8-14 11v-72c0-35 29-64 64-64h75L670 861z" />
                <path fill="#555" d="M368 352h288c18 0 32-14 32-32s-14-32-32-32H368c-18 0-32 14-32 32s14 32 32 32zm128 256H368c-18 0-32 14-32 32s14 32 32 32h128c18 0 32-14 32-32s-14-32-32-32zm-128-96h288c18 0 32-14 32-32s-14-32-32-32H368c-18 0-32 14-32 32s14 32 32 32z" />
            </svg>
            <input
                type="file"
                ref={fileInputRef}
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default function Toolbar({ onAdd }: ToolbarProps) {

    return (
        <div className="common-tools-container">
            {/* 快捷工具-填入一行TODO */}
            <Todo onClick={onAdd} />
            {/* 快捷工具-填入当前页链接 */}
            <GetLink onClick={onAdd} />
            {/* 上传文件并插入到文本当前末尾 */}
            <Upload />
        </div>
    );
};
