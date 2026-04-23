/**
 * 患者端小程序 Demo 状态管理与通用逻辑
 */

const STORAGE_KEY = 'patient_info';

const App = {
    // 获取当前患者信息
    getPatientInfo() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    // 保存患者信息
    savePatientInfo(info) {
        const current = this.getPatientInfo() || {};
        const updated = { ...current, ...info };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    // 检查注册状态：绑定后即可进首页
    checkAuth(currentPage) {
        const info = this.getPatientInfo();
        const publicPages = ['scan.html'];
        
        if (!info && !publicPages.includes(currentPage)) {
            window.location.href = 'scan.html';
            return false;
        }
        
        // 已绑定用户不需要再扫码
        if (info && info.isBound && currentPage === 'scan.html') {
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    },

    // 退出登录
    logout() {
        if (confirm('确定要退出登录并清除本地数据吗？')) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.href = 'scan.html';
        }
    },

    // 路由跳转工具
    navigateTo(url) {
        window.location.href = url;
    },

    // 格式化日期
    formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },

    // 模拟 OCR 识别（根据上传类型返回不同的模拟数据）
    simulateOCR(type) {
        const results = {
            idcard: { name: '林建国', idCard: '310115199203151234', gender: '男', birthDate: '1992-03-15' },
            diagnosis: { disease: '非小细胞肺癌 (NSCLC)', stage: 'III期', hospital: '上海交通大学附属瑞金医院' },
            prescription: { medication: 'PD-1 单抗 + 顺铂', dosage: '200mg Q3W', prescDate: '2024-04-10' },
            consent: { signDate: App.formatDate(new Date()), status: '已签署' }
        };
        return results[type] || {};
    },

    // 获取建档完成状态
    getProfileStatus() {
        const info = this.getPatientInfo();
        if (!info) return { isBound: false, hasIdCard: false, hasDiagnosis: false, hasConsent: false };
        return {
            isBound: !!info.isBound,
            hasIdCard: !!info.ocrIdCard,
            hasDiagnosis: !!info.ocrDiagnosis,
            hasConsent: !!info.ocrConsent,
            isComplete: !!info.ocrIdCard && !!info.ocrDiagnosis && !!info.ocrConsent
        };
    }
};

// 模拟数据
const MockData = {
    doctors: [
        { id: 'D001', name: '王医生', hospital: '君实附属第一医院', dept: '肿瘤科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { id: 'D002', name: '李主任', hospital: '君实附属第一医院', dept: '免疫科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria' }
    ],
    educationList: [
        { id: 1, title: '初诊患者用药指导手册', type: '用药指导', date: '2024-03-20', readCount: 1250, cover: 'doc-cover-1' },
        { id: 2, title: '日常生活中的营养膳食建议', type: '生活调理', date: '2024-03-18', readCount: 840, cover: 'doc-cover-2' },
        { id: 3, title: '常见副作用的处理方法', type: '注意事项', date: '2024-03-15', readCount: 2100, cover: 'doc-cover-3' }
    ],
    messages: [
        { id: 101, title: '随访提醒', content: '您有一个新的随访计划，请及时查看并填报。', time: '10:30', unread: true },
        { id: 102, title: '用药提醒', content: '医生已为您更新了用药方案。', time: '昨天', unread: false }
    ]
};
