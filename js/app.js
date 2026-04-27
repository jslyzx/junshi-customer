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
            hasIdCardBack: !!info.ocrIdCardBack,
            hasDiagnosis: !!info.ocrDiagnosis,
            hasConsent: !!info.ocrConsent,
            isComplete: !!info.ocrIdCard && !!info.ocrIdCardBack && !!info.ocrDiagnosis && !!info.ocrConsent
        };
    }
};

// 模拟数据
const MockData = {
    doctors: [
        { id: 'D001', name: '王晓雅', hospital: '南京鼓楼医院', dept: '肿瘤科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { id: 'D002', name: '张伟', hospital: '复旦大学附属肿瘤医院', dept: '免疫科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria' }
    ],
    educationList: [
        // 疾病知识
        { id: 1, title: '非小细胞肺癌分型与分期详解', category: '疾病知识', type: '图文', date: '2024-04-15', readCount: 3200, icon: '📖' },
        { id: 2, title: '免疫治疗的作用原理与适应症', category: '疾病知识', type: '图文', date: '2024-04-10', readCount: 2850, icon: '📖' },
        { id: 3, title: 'PD-1/PD-L1 抑制剂常见问答', category: '疾病知识', type: '图文', date: '2024-04-05', readCount: 4100, icon: '📖' },
        { id: 4, title: '肿瘤标志物指标解读指南', category: '疾病知识', type: '图文', date: '2024-03-28', readCount: 1870, icon: '📖' },
        // 健康资讯
        { id: 5, title: '治疗期间营养膳食搭配建议', category: '健康资讯', type: '图文', date: '2024-04-12', readCount: 1560, icon: '💡' },
        { id: 6, title: '化疗后居家护理注意事项', category: '健康资讯', type: '图文', date: '2024-04-08', readCount: 2340, icon: '💡' },
        { id: 7, title: '放疗后皮肤管理与日常防护', category: '健康资讯', type: '图文', date: '2024-04-01', readCount: 980, icon: '💡' },
        { id: 8, title: '运动康复：适合肿瘤患者的锻炼方式', category: '健康资讯', type: '图文', date: '2024-03-25', readCount: 1230, icon: '💡' },
        // 专家讲座
        { id: 9, title: '王晓雅：免疫联合治疗的最新进展', category: '专家讲座', type: '回放', date: '2024-04-14', readCount: 5600, icon: '🎓', duration: '45 min' },
        { id: 10, title: '张伟：ADC 药物的临床应用与展望', category: '专家讲座', type: '回放', date: '2024-04-07', readCount: 3200, icon: '🎓', duration: '38 min' },
        { id: 11, title: '李四：肿瘤患者心理调适与支持', category: '专家讲座', type: '回放', date: '2024-03-30', readCount: 2100, icon: '🎓', duration: '52 min' },
        // 视频教育
        { id: 12, title: '输液港日常维护操作演示', category: '视频教育', type: '视频', date: '2024-04-11', readCount: 4300, icon: '🎬', duration: '8 min' },
        { id: 13, title: '居家自我注射操作指南', category: '视频教育', type: '视频', date: '2024-04-06', readCount: 2900, icon: '🎬', duration: '12 min' },
        { id: 14, title: '常见药物不良反应的自我识别', category: '视频教育', type: '视频', date: '2024-03-29', readCount: 3700, icon: '🎬', duration: '15 min' },
        { id: 15, title: 'PICC 导管居家护理要点', category: '视频教育', type: '视频', date: '2024-03-22', readCount: 1800, icon: '🎬', duration: '10 min' }
    ],
    messages: [
        { id: 101, title: '随访提醒', content: '您有一个新的随访计划，请及时查看并填报。', time: '10:30', unread: true },
        { id: 102, title: '用药提醒', content: '医生已为您更新了用药方案。', time: '昨天', unread: false }
    ]
};
