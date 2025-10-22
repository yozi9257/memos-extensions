import axios from 'axios';
import type { AxiosInstance } from 'axios';
import toast from 'react-hot-toast';
import { readFileAsBase64 } from "./files"

// 类型定义
interface MemosQueryParas {
    pageSize?: number;
    pageToken?: string;
    state?: "STATE_UNSPECIFIED" | "NORMAL" | "ARCHIVED";
    orderBy?: string;
    filter?: string;
    showDeleted?: boolean;
}

interface MemosPostParas {
    memoId?: string;
    requestId?: string;
    validateOnly?: boolean;
}

export interface Node {
    type?: string;
    lineBreakNode?: Object;
    paragraphNode?: Object;
    codeBlockNode?: Object;
    headingNode?: Object;
    horizontalRuleNode?: Object;
    blockquoteNode?: Object;
    listNode?: Object;
    orderedListItemNode?: Object;
    unorderedListItemNode?: Object;
    taskListItemNode?: Object;
    mathBlockNode?: Object;
    tableNode?: Object;
    textNode?: Object;
    boldNode?: Object;
    italicNode?: Object;
    boldItalicNode?: Object;
    codeNode?: Object;
    embeddedContentNode?: Object;
    imageNode?: Object;
    linkNode?: Object;
    autoLinkNode?: Object;
    tagNode?: Object;
    strikethroughNode?: Object;
    escapingCharacterNode?: Object;
    mathNode?: Object;
    highlightNode?: Object;
    subscriptNode?: Object;
    superscriptNode?: Object;
    referencedContentNode?: Object;
    spoilerNode?: Object;
    htmlElementNode?: Object;
}

export interface Memo {
    name?: string;
    state: "STATE_UNSPECIFIED" | "NORMAL" | "ARCHIVED";
    creator?: string;
    createTime?: string;
    updateTime?: string;
    displayTime?: string;
    content: string;
    nodes?: Node[];
    visibility: "VISIBILITY_UNSPECIFIED" | "PRIVATE" | "PROTECTED" | "PUBLIC";
    tags?: string[];
    pinned?: boolean;
    attachments?: Attachment[];
    relations?: Object[];
    reactions?: Object[];
    property?: Object;
    parent?: string;
    snippet?: string;
    location?: Object;
}

interface Attachment {
    filename: string;
    type: string;
    name?: string;
    externalLink?: string;
    memo?: string;
    size?: string;
    createTime?: string;
    content?: string;
}

export interface ListMemosResponse {
    memos: Memo[];
    nextPageToken: string;
    totalSize: number;
}

// 创建 Axios 实例
export const createMemosInstance = (apiUrl: string, apiToken: string): AxiosInstance => {
    // 校验输入是否为空
    if (!apiUrl || !apiToken) {
        throw new Error("API URL 或 API Token 不能为空");
    }
    const memos = axios.create({
        baseURL: apiUrl,
        timeout: 2000,
        headers: {
            'Authorization': 'Bearer ' + apiToken
        }
    });
    return memos;
}

// 获取用户ID
export const getUserId = async (memos: AxiosInstance): Promise<string | undefined> => {
    try {
        const response = await memos.get('/api/v1/auth/sessions/current');
        return response.data.user.name.split('/').pop()
    } catch (error) {
        console.error(error);
        (toast as any).error(chrome.i18n.getMessage("memoFailed"));
        return undefined
    }
};

// 获取所有memos
export const getAllMemos = async (memos: AxiosInstance): Promise<ListMemosResponse | undefined> => {
    try {
        const response = await memos.get('/api/v1/memos');
        return response.data
    } catch (error) {
        (toast as any).error(chrome.i18n.getMessage("memoFailed"));
        console.error(error);
    }
};

// 获取所有tags
export const getAllTags = async (memos: AxiosInstance): Promise<string[]> => {
    try {
        const seen = new Set<string>();
        const result: string[] = [];
        const response = await memos.get('/api/v1/memos');
        const memosList: Memo[] = response.data.memos
        for (let index = 0; index < memosList.length; index++) {
            const element = memosList[index];
            if (element !== null && 'tags' in element) {
                for (const item of element.tags) {
                    if (!seen.has(item)) {
                        seen.add(item);
                        result.push(item);
                    }
                }
            }
        }
        return result
    } catch (error) {
        console.error(error);
        (toast as any).error(chrome.i18n.getMessage("memoFailed"));
        return []
    }
};

// 创建附件并保存附件列表信息
export const createAttachment = async (memos: AxiosInstance, file: File): Promise<Attachment> => {
    try {
        // 读取文件内容为sbytes (Uint8Array)
        const fileContent = await readFileAsBase64(file);
        // 构建请求体
        const requestData: Attachment = {
            filename: file.name,
            type: file.type,
            content: fileContent
        };

        const response = await memos.post('/api/v1/attachments', requestData);
        if (response.status === 200) {
            // 保存附件信息
            const attachment: Attachment = {
                name: response.data.name,
                createTime: response.data.createTime,
                type: response.data.type,
                filename: response.data.filename
            };
            return attachment
        } else {
            (toast as any).error(chrome.i18n.getMessage("picFailed"));
            return {} as Attachment;
        }
    } catch (error) {
        console.error(error);
        return {} as Attachment;
    }
}

// 删除指定附件
export const deleteAttachment = async (memos: AxiosInstance, attachmentId: string): Promise<boolean> => {
    try {
        if (attachmentId && attachmentId.trim() !== '') {
            const response = await memos.delete('/api/v1/attachments/'.concat(attachmentId));
            if (response.status === 200) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }

}

// 创建新的memo
export const createMemos = async (memos: AxiosInstance, requestData: Memo): Promise<boolean> => {
    try {
        const response = await memos.post('/api/v1/memos', requestData);
        if (response.status === 200) {
            console.log(response);
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
};


