import { event_types, eventSource } from "../../../../script.js";

// 扩展配置
const extensionName = "st-ui-echo";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

/**
 * 核心逻辑：扫描并注入 UI
 * 自动寻找消息中的指令链接并挂载样式类
 */
function hydrateMessage(messageId) {
    // 获取消息 DOM
    const messageElement = document.querySelector(`[data-id="${messageId}"]`);
    if (!messageElement) return;

    // 寻找所有以 /send 开头的指令链接
    const actionLinks = messageElement.querySelectorAll('a[href^="/send"]');

    actionLinks.forEach(link => {
        // 1. 防抖：如果已经处理过，直接跳过
        if (link.classList.contains('st-echo-btn')) return;

        // 2. 注入专属类名
        link.classList.add('st-echo-btn');

        // 3. 语义化增强：如果是特定的指令，可以额外打标签（方便未来做彩色按钮）
        const command = link.getAttribute('href');
        if (command.includes('攻击') || command.includes('战斗')) {
            link.classList.add('st-echo-danger');
        }
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