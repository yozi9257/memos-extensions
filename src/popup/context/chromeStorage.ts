// 定义存储数据的类型接口（根据你的实际需求扩展）
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

export interface StorageData {
  apiUrl?: string;
  apiToken?: string;
  userId?: string;
  editorType?: string;
  editorContent?: string;
  visibility?: string;
  tags?: string[];
  attachments?: Attachment[];
}

// 将 chrome.storage.sync 操作封装为 Promise
export const chromeStorage = {
  // 获取存储值（支持获取单个键或所有键）
  get: async <K extends keyof StorageData>(key?: K): Promise<Partial<StorageData>> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        resolve(result as Partial<StorageData>);
      });
    });
  },

  // 设置存储值（支持部分更新）
  set: async (data: Partial<StorageData>): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.sync.set(data, () => {
        resolve();
      });
    });
  },

  // 删除存储值
  remove: async (key: keyof StorageData): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(key, () => {
        resolve();
      });
    });
  },

  // 监听存储变化
  onChanged: (callback: (changes: { [K in keyof StorageData]?: chrome.storage.StorageChange }) => void) => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        callback(changes as { [K in keyof StorageData]?: chrome.storage.StorageChange });
      }
    });
  }
};
