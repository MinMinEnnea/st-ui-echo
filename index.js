import { event_types, eventSource } from "../../../../script.js";

// 扩展配置
const extensionName = "st-ui-echo";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

/**
 * 核心逻辑：扫描并注入 UI
 * 自动寻找消息中的指令链接并挂载样式类
 */
function hydrateMessage(messageId) {
    console.log(`[st-ui-echo] 尝试扫描消息 ID: ${messageId}`);
    
    // 获取消息 DOM
    const messageElement = document.querySelector(`[data-id="${messageId}"]`);
    
    if (!messageElement) {
        console.error(`[st-ui-echo] 找不到 DOM 节点: [data-id="${messageId}"]`);
        return;
    }

    const actionLinks = messageElement.querySelectorAll('a[href^="/send"]');
    console.log(`[st-ui-echo] 在消息中找到了 ${actionLinks.length} 个指令链接`);

    actionLinks.forEach(link => {
        link.classList.add('st-echo-btn');
        // 强制给个明显的边框测试
        link.style.outline = '3px solid lime'; 
    });
}

/**
 * 插件初始化
 */
jQuery(async () => {
    // 动态注入配套的 CSS 样式表
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `${extensionFolderPath}/style.css`;
    document.head.appendChild(styleLink);

    // 注册监听器：当 AI 生成消息完毕或加载历史记录时触发
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, (messageId) => {
        hydrateMessage(messageId);
    });

    // 注册监听器：用户发送的消息也可以触发（如果你自己想点自己的指令）
    eventSource.on(event_types.USER_MESSAGE_RENDERED, (messageId) => {
        hydrateMessage(messageId);
    });

    console.log(`[${extensionName}] 自动 UI 注入器已就绪。`);
});
