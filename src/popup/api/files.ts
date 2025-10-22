// 将文件读取为Uint8Array (sbytes)
export const readFileAsBytes = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(new Uint8Array(reader.result));
            } else {
                reject(new Error('无法读取文件内容'));
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

// 将文件读取为Base64字符串
export const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // FileReader.readAsDataURL返回格式为 "data:[<mediatype>];base64,<data>"
            // 这里截取base64部分
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1];
                resolve(base64String || '');
            } else {
                reject(new Error('无法读取文件内容'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // 使用readAsDataURL获取Base64
    });
};

