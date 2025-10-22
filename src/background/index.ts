// 添加上下文菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      type: 'normal',
      title: chrome.i18n.getMessage("sendTo"),
      id: 'Memos-send-selection',
      contexts: ['selection']
    },
  )
  chrome.contextMenus.create(
    {
      type: 'normal',
      title: chrome.i18n.getMessage("sendLinkTo"),
      id: 'Memos-send-link',
      contexts: ['link', 'page']
    },
  )
  chrome.contextMenus.create(
    {
      type: 'normal',
      title: chrome.i18n.getMessage("sendImageTo"),
      id: 'Memos-send-image',
      contexts: ['image']
    },
  )
})


// 处理上下文菜单逻辑
chrome.contextMenus.onClicked.addListener(info => {
  let tempCont = ''
  switch (info.menuItemId) {
    case 'Memos-send-selection':
      tempCont = info.selectionText + '\n'
      break
    case 'Memos-send-link':
      tempCont = (info.linkUrl || info.pageUrl) + '\n'
      break
    case 'Memos-send-image':
      tempCont = `![](${info.srcUrl})` + '\n'
      break
  }
  chrome.storage.sync.get({ editorType: "save_text", editorContent: '' }, function (items) {
    if (items.editorType === 'upload_image') {
      alert(chrome.i18n.getMessage("picPending"));
    } else {
      chrome.storage.sync.set({ editorType: "save_text", editorContent: items.editorContent + tempCont });
    }
  })
})

// Debug，响应数据保存的操作
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });