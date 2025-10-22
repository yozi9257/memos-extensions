import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import Toolbar from "./Toolbar";
import { useChromeStorage } from '../context/StorageContext';
import { createMemosInstance, createMemos, createAttachment, deleteAttachment, Attachment } from "../api/memos"

export default function Editor() {
    // 获取存储操作方法
    const { storage, setStorage, removeStorage, isInitialized } = useChromeStorage();
    // 状态管理
    const [editorType, setEditorType] = useState<string>('');
    const [editorContent, setEditorContent] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedVisibility, setSelectedVisibility] = useState('PRIVATE');
    const [afileList, setAfileList] = useState<Attachment[]>([]);

    // 组件挂载后设置焦点
    useEffect(() => {
        // 确保ref已正确关联到元素
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    // 初始化：从存储中加载当前值到表单
    useEffect(() => {
        if (isInitialized) {
            setEditorType(storage.editorType || 'save_text');
            setEditorContent(storage.editorContent || '');
            setSelectedVisibility(storage.visibility || 'PRIVATE');
            setAfileList(storage.attachments || []);
        }
    }, [isInitialized, storage.editorType, storage.editorContent, storage.attachments]);

    // 输入框失去焦点时保存内容到chrome.storage.sync存储
    const handleTextAreaBlur = async (event: React.FocusEvent<HTMLTextAreaElement>) => {
        // 输入框失去焦点后，保存当前输入框的值到chrome.storage.sync存储
        setEditorContent(event.target.value);
        await setStorage({ editorType: 'save_text', editorContent: event.target.value });
    }

    // 输入框内容变化时更新状态
    const handleTextAreaChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditorContent(event.target.value);
        await setStorage({ editorType: 'save_text', editorContent: event.target.value });
    }

    // 选择框内容变化时更新状态
    const handleSelectedVisibilityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVisibility(event.target.value);
        await setStorage({ visibility: event.target.value });
    }

    // 点击删除已上传文件按钮时删除文件和缓存记录
    const handleDeleteSelectedFile = async (attachmentName: string) => {
        const attachmentId = attachmentName.split('/')[1];
        const memos = createMemosInstance(storage.apiUrl, storage.apiToken);
        const isDel = await deleteAttachment(memos, attachmentId);
        if (isDel) {
            // 删除对应缓存
            const updatedAfileList = afileList.filter(af => af.name !== attachmentName);
            await setStorage({ attachments: updatedAfileList });
        } else {
            (toast as any).error(chrome.i18n.getMessage("memoFailed"));
        }
    }

    const handleSendMemos = async () => {
        try {
            const curContent = storage.editorContent;
            if (curContent && curContent.trim() !== '') {
                const memos = createMemosInstance(storage.apiUrl, storage.apiToken);
                const requestData = {
                    state: "NORMAL",
                    visibility: storage.visibility,
                    content: storage.editorContent,
                    attachments: storage.attachments || []
                };

                const isSend = await createMemos(memos, requestData);
                if (isSend) {
                    // 清空编辑器内容
                    setEditorContent('');
                    // 清空chrome.storage.sync存储的内容
                    await removeStorage(['editorType', 'editorContent', 'attachments', 'tags']);
                    (toast as any).success(chrome.i18n.getMessage("memoSuccess"));
                } else {
                    (toast as any).error(chrome.i18n.getMessage("memoFailed"));
                }
            } else {
                (toast as any).error(chrome.i18n.getMessage("invalidContent"));

            }

        } catch (e) {
            console.log(e);
        }
    }

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        // 阻止默认粘贴行为
        e.preventDefault();

        // 从剪贴板获取数据
        const clipboardData = e.clipboardData || window.Clipboard;
        const items = clipboardData.items;

        if (!items) return;

        // 遍历剪贴板项目
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // 检查是否为图片类型
            if (item) {
                if (item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    if (blob) {
                        try {
                            // 显示上传中提示
                            const loadingToast = (toast as any).loading('图片上传中...');

                            // 创建文件对象
                            const file = new File([blob], `paste-${Date.now()}.${item.type.split('/')[1]}`, {
                                type: item.type
                            });

                            // 上传图片
                            const memos = createMemosInstance(storage.apiUrl, storage.apiToken);
                            const attachment = await createAttachment(memos, file);

                            // 上传成功后更新附件列表
                            if (attachment.name) {
                                const existingAttachments = storage.attachments || [];
                                const updatedAttachments: Attachment[] = [...existingAttachments, attachment];
                                await setStorage({ attachments: updatedAttachments });
                                (toast as any).success(chrome.i18n.getMessage("picSuccess"), {
                                    id: loadingToast
                                });
                            } else {
                                throw new Error('图片上传失败');
                            }
                        } catch (error) {
                            console.error('粘贴图片上传失败:', error);
                            (toast as any).error(chrome.i18n.getMessage("picFailed"));
                        }
                    }
                }
            }

        }
    }

    // 在Editor组件中添加文本的方法
    const addText = (addStr: string) => {
        // 在现有内容末尾添加 addStr 参数内容
        const newContent = editorContent + addStr;
        setEditorContent(newContent);
        setStorage({ editorType: 'save_text', editorContent: newContent });
        // 确保输入框获得焦点
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    if (!isInitialized) {
        return <div>{chrome.i18n.getMessage("loading")}</div>;
    }

    return (
        <>
            <div className="memo-editor">
                <textarea
                    id="content"
                    name="text"
                    className="common-editor-inputer"
                    rows={4}
                    placeholder={chrome.i18n.getMessage("placeContent")}
                    required={true}
                    ref={textareaRef}
                    value={editorContent}
                    onBlur={handleTextAreaBlur}
                    onChange={handleTextAreaChange}
                    onPaste={handlePaste}
                />
            </div>
            {/* 已上传附件清单 */}
            <div className="file-list-container">
                {afileList.map(item => (
                    <div className="file-item">
                        <div className="file-info">
                            <div className="file-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="file-icon-svg">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" x2="12" y1="3" y2="15"></line>
                                </svg>
                            </div>
                            <span className="file-name">{item.filename}</span>
                        </div>
                        <button className="delete-btn" onClick={() => handleDeleteSelectedFile(item.name)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="delete-icon">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            {/* 功能栏 */}
            <div className="common-tools-wrapper">
                <Toolbar onAdd={addText} />
                {/* 选择memos可见性 */}
                <select
                    value={selectedVisibility}
                    onChange={handleSelectedVisibilityChange}
                >
                    <option value="PRIVATE">{chrome.i18n.getMessage("lockPrivate")}</option>
                    <option value="PROTECTED">{chrome.i18n.getMessage("lockProtected")}</option>
                    <option value="PUBLIC">{chrome.i18n.getMessage("lockPublic")}</option>
                </select>
                {/* 提交按键 */}
                <div className="btns-container" id="submit">
                    <button id="content_submit_text" className="action-btn confirm-btn" onClick={handleSendMemos}>{chrome.i18n.getMessage("submitBtn")}</button>
                </div>
            </div>
        </>
    );
};
