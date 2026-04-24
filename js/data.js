/**
 * myPrototype 模拟数据
 * 江森自控 (Johnson Controls) - 仓储与试制管理系统
 */

// ==================== 用户数据 ====================
const Users = {
    // 预设用户
    data: [
        { id: 1, username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', department: 'IT部', manager: '' },
        { id: 2, username: 'keeper01', password: 'keeper123', name: '张三', role: 'keeper', department: '仓储部', manager: '王经理' },
        { id: 3, username: 'keeper02', password: 'keeper123', name: '李四', role: 'keeper', department: '仓储部', manager: '王经理' },
        { id: 4, username: 'engineer01', password: 'engineer123', name: '王五', role: 'engineer', department: '研发部', manager: '刘经理' },
        { id: 5, username: 'engineer02', password: 'engineer123', name: '赵六', role: 'engineer', department: '工程部', manager: '陈经理' }
    ],
    
    // 登录验证
    login(username, password) {
        const user = this.data.find(u => u.username === username && u.password === password);
        if (user) {
            const { password, ...userInfo } = user;
            Storage.set('currentUser', userInfo);
            return { success: true, user: userInfo };
        }
        return { success: false, message: '用户名或密码错误' };
    },
    
    // 获取当前用户
    getCurrentUser() {
        return Storage.get('currentUser');
    },
    
    // 登出
    logout() {
        Storage.remove('currentUser');
    },
    
    // 检查权限
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },
    
    // 检查是否登录
    isLoggedIn() {
        return !!this.getCurrentUser();
    }
};

// ==================== 常量数据 ====================
const Constants = {
    // PBU 选项
    PBU_OPTIONS: ['PBU-A', 'PBU-B', 'PBU-C'],
    
    // 免3C 选项
    EXEMPT_3C_OPTIONS: ['是', '否'],
    
    // 物料类别
    MATERIAL_CATEGORIES: ['室外机', '室内机', '压缩机', '控制箱', '工装', '化学品', '新物料', '拆机物料', '工具辅料'],
    
    // 单位选项
    UNIT_OPTIONS: ['PCS', 'KG', '套', '米', '升'],
    
    // 仓库选项
    WAREHOUSE_OPTIONS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', '研发中心实验室仓', '原材料一仓'],
    
    // 货位选项（示例）
    LOCATION_OPTIONS: [
        'A-0-0-0-0', 'A-0-0-0-1', 'A-0-0-0-2',
        'B-0-0-0-0', 'B-0-0-0-1', 'B-0-0-0-2',
        'C-0-0-0-0', 'C-0-0-0-1', 'C-0-0-0-2'
    ],
    
    // 账龄周期阈值
    AGING_THRESHOLDS: [
        { value: 30, label: '>30天' },
        { value: 60, label: '>60天' },
        { value: 90, label: '>90天' }
    ],
    
    // 呆滞周期阈值
    DORMANT_THRESHOLDS: [
        { value: 30, label: '>30天' },
        { value: 90, label: '>90天' },
        { value: 180, label: '>180天' }
    ],
    
    // 流程状态
    FLOW_STATUS: {
        PENDING: { value: 'pending', label: '待处理', color: 'warning' },
        APPROVING: { value: 'approving', label: '审批中', color: 'blue' },
        APPROVED: { value: 'approved', label: '已通过', color: 'success' },
        REJECTED: { value: 'rejected', label: '已驳回', color: 'danger' },
        COMPLETED: { value: 'completed', label: '已完成', color: 'success' }
    },
    
    // 流程类型
    FLOW_TYPES: {
        INBOUND_ENGINEER: { value: 'inbound_engineer', label: '工程师入库', icon: 'fa-sign-in-alt' },
        OUTBOUND_REQUEST: { value: 'outbound_request', label: '领用申请', icon: 'fa-sign-out-alt' },
        OUTBOUND_SCRAP: { value: 'outbound_scrap', label: '报废出库', icon: 'fa-trash-alt' },
        TRANSFER: { value: 'transfer', label: '移库申请', icon: 'fa-exchange-alt' },
        EXPRESS: { value: 'express', label: '快递发运', icon: 'fa-shipping-fast' },
        SCRAP_WORKFLOW: { value: 'scrap_workflow', label: '报废电子流程', icon: 'fa-file-alt' }
    }
};

// ==================== 库存数据 ====================
const Inventory = {
    // 模拟库存数据
    data: [],
    
    // 初始化数据
    init() {
        const materials = [
            { name: '室外机-1.5P', code: 'OUT-001', category: '室外机' },
            { name: '室内机-1.5P', code: 'IN-001', category: '室内机' },
            { name: '压缩机-1.5P', code: 'COM-001', category: '压缩机' },
            { name: '控制箱-标准型', code: 'CTL-001', category: '控制箱' },
            { name: '工装夹具-A型', code: '', category: '工装' },
            { name: '制冷剂-R410A', code: '', category: '化学品' },
            { name: '新物料-测试品', code: '', category: '新物料' },
            { name: '拆机物料-电机', code: '', category: '拆机物料' },
            { name: '工具辅料-螺丝', code: '', category: '工具辅料' }
        ];
        
        const warehouses = ['A', 'B', 'C', 'D', 'E'];
        const owners = ['张三', '李四', '王五', '赵六'];
        const departments = ['仓储部', '研发部', '工程部'];
        
        for (let i = 0; i < 50; i++) {
            const material = materials[Math.floor(Math.random() * materials.length)];
            const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
            const owner = owners[Math.floor(Math.random() * owners.length)];
            const department = departments[Math.floor(Math.random() * departments.length)];
            
            // 生成随机入库时间（最近180天内）
            const daysAgo = Math.floor(Math.random() * 180);
            const inboundDate = new Date();
            inboundDate.setDate(inboundDate.getDate() - daysAgo);
            
            const quantity = Math.floor(Math.random() * 100) + 1;
            const used = Math.floor(Math.random() * quantity * 0.5);
            
            this.data.push({
                id: i + 1,
                materialName: material.name,
                materialCode: material.code,
                projectCode: `PRJ-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                pbu: Constants.PBU_OPTIONS[Math.floor(Math.random() * 3)],
                exempt3C: Math.random() > 0.5 ? '是' : '否',
                materialCategory: material.category,
                owner: owner,
                department: department,
                poNumber: `PO-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
                supplierCode: `SUP-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                quantity: quantity,
                unit: 'PCS',
                inboundTime: inboundDate.toISOString(),
                inboundNo: `SYS-${Date.now()}-${i}`,
                remainingStock: quantity - used,
                agingDays: daysAgo,
                dormantDays: daysAgo > 90 ? daysAgo - 90 : 0,
                warehouse: warehouse,
                location: `${warehouse}-${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}`,
                unitPrice: (Math.random() * 1000 + 100).toFixed(2),
                applicant: owner
            });
        }
        
        // 保存到本地存储
        this.save();
    },
    
    // 保存到本地存储
    save() {
        Storage.set('inventory', this.data);
    },
    
    // 从本地存储加载
    load() {
        const data = Storage.get('inventory');
        if (data && data.length > 0) {
            this.data = data;
        } else {
            this.init();
        }
    },
    
    // 获取所有库存
    getAll() {
        return this.data;
    },
    
    // 根据ID获取
    getById(id) {
        return this.data.find(item => item.id === id);
    },
    
    // 搜索库存
    search(filters = {}) {
        return this.data.filter(item => {
            for (let key in filters) {
                if (filters[key] && !item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())) {
                    return false;
                }
            }
            return true;
        });
    },
    
    // 添加库存
    add(item) {
        item.id = Date.now();
        item.inboundNo = `SYS-${Date.now()}`;
        item.inboundTime = new Date().toISOString();
        item.remainingStock = item.quantity;
        item.agingDays = 0;
        item.dormantDays = 0;
        this.data.push(item);
        this.save();
        return item;
    },
    
    // 更新库存
    update(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updates };
            this.save();
            return this.data[index];
        }
        return null;
    },
    
    // 减少库存（出库）
    decreaseStock(id, quantity) {
        const item = this.getById(id);
        if (item && item.remainingStock >= quantity) {
            item.remainingStock -= quantity;
            this.save();
            return true;
        }
        return false;
    },
    
    // 获取账龄超期库存
    getAgingOverdue(days) {
        return this.data.filter(item => item.agingDays > days);
    },
    
    // 获取呆滞库存
    getDormantOverdue(days) {
        return this.data.filter(item => item.dormantDays > days);
    }
};

// ==================== 流程数据 ====================
const Flows = {
    data: [],

    // 初始化
    init() {
        const data = Storage.get('flows');
        if (data) {
            this.data = data;
        }
    },

    // 保存
    save() {
        Storage.set('flows', this.data);
    },

    // 创建流程
    create(type, data, options = {}) {
        const flow = {
            id: Date.now(),
            flowNo: this.generateFlowNo(type),
            type: type,
            status: options.status || 'pending',
            currentStep: options.currentStep || null,
            approvalHistory: [],
            createTime: new Date().toISOString(),
            creator: Users.getCurrentUser()?.name || '未知',
            creatorId: Users.getCurrentUser()?.id || 0,
            data: data,
            approver: Users.getCurrentUser()?.manager || '',
            approveTime: null,
            approveComment: ''
        };

        this.data.push(flow);
        this.save();
        return flow;
    },

    // 生成流程单号
    generateFlowNo(type) {
        const prefix = {
            inbound_engineer: 'FLOW',
            outbound_request: 'REQ',
            outbound_scrap: 'SCRAP',
            transfer: 'TRANS',
            express: 'EXP',
            scrap_workflow: 'SCRAPWF'
        }[type] || 'FLOW';

        return `${prefix}-${Date.now()}`;
    },

    // 获取所有流程
    getAll() {
        return this.data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    },

    // 获取待办流程
    getPending() {
        return this.data
            .filter(f => f.status === 'pending')
            .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    },

    // 获取我的申请
    getMyFlows() {
        const userId = Users.getCurrentUser()?.id;
        return this.data
            .filter(f => f.creatorId === userId)
            .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    },

    // 审批流程
    approve(id, comment = '') {
        const flow = this.data.find(f => f.id === id);
        if (flow) {
            flow.status = 'approved';
            flow.approveTime = new Date().toISOString();
            flow.approveComment = comment;
            this.save();
            return flow;
        }
        return null;
    },

    // 驳回流程
    reject(id, comment = '') {
        const flow = this.data.find(f => f.id === id);
        if (flow) {
            flow.status = 'rejected';
            flow.approveTime = new Date().toISOString();
            flow.approveComment = comment;
            this.save();
            return flow;
        }
        return null;
    },

    // 完成流程
    complete(id) {
        const flow = this.data.find(f => f.id === id);
        if (flow) {
            flow.status = 'completed';
            this.save();
            return flow;
        }
        return null;
    },

    // ====== 多级审批扩展（报废电子流程专用）======

    // 推进流程到下一步
    advance(id, step, approverName, comment = '') {
        const flow = this.data.find(f => f.id === id);
        if (flow) {
            // 记录审批历史
            if (flow.currentStep) {
                flow.approvalHistory.push({
                    step: flow.currentStep,
                    approver: approverName,
                    result: 'approved',
                    comment: comment,
                    time: new Date().toISOString()
                });
            }
            flow.currentStep = step;
            if (step === 'completed' || step === 'rejected') {
                flow.status = step;
                flow.approveTime = new Date().toISOString();
            }
            this.save();
            return flow;
        }
        return null;
    },

    // 驳回并记录历史
    rejectWithHistory(id, approverName, comment = '') {
        const flow = this.data.find(f => f.id === id);
        if (flow) {
            if (flow.currentStep) {
                flow.approvalHistory.push({
                    step: flow.currentStep,
                    approver: approverName,
                    result: 'rejected',
                    comment: comment,
                    time: new Date().toISOString()
                });
            }
            flow.status = 'rejected';
            flow.currentStep = 'rejected';
            flow.approveTime = new Date().toISOString();
            flow.approveComment = comment;
            this.save();
            return flow;
        }
        return null;
    },

    // 按类型和步骤获取待办
    getByTypeAndStep(type, step) {
        return this.data
            .filter(f => f.type === type && f.currentStep === step)
            .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    },

    // 获取报废流程待办（按步骤）
    getScrapWorkflowTodos(step) {
        return this.getByTypeAndStep('scrap_workflow', step);
    }
};

// ==================== 购物车 ====================
const Cart = {
    items: [],
    
    // 添加商品
    add(item) {
        const existing = this.items.find(i => i.materialId === item.materialId);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        this.save();
    },
    
    // 移除商品
    remove(materialId) {
        this.items = this.items.filter(i => i.materialId !== materialId);
        this.save();
    },
    
    // 更新数量
    updateQuantity(materialId, quantity) {
        const item = this.items.find(i => i.materialId === materialId);
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    },
    
    // 清空购物车
    clear() {
        this.items = [];
        this.save();
    },
    
    // 获取所有商品
    getAll() {
        return this.items;
    },
    
    // 获取总数
    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // 保存到本地
    save() {
        Storage.set('cart', this.items);
    },
    
    // 从本地加载
    load() {
        this.items = Storage.get('cart', []);
    }
};

// ==================== 仓库数据 ====================
const Warehouses = {
    data: [],

    init() {
        const data = Storage.get('warehouses');
        if (data && data.length > 0) {
            this.data = data;
        } else {
            // 默认仓库数据
            this.data = [
                { id: 1, name: 'A', location: '一号厂房东侧', attribute: '室内/封闭', type: '货架', createTime: new Date().toISOString() },
                { id: 2, name: 'B', location: '一号厂房西侧', attribute: '室内/半封闭', type: '货架+地面', createTime: new Date().toISOString() },
                { id: 3, name: 'C', location: '二号厂房北侧', attribute: '室外/封闭', type: '地面', createTime: new Date().toISOString() }
            ];
            this.save();
        }
    },

    save() {
        Storage.set('warehouses', this.data);
    },

    getAll() {
        return this.data;
    },

    getById(id) {
        return this.data.find(item => item.id === id);
    },

    add(item) {
        item.id = Date.now();
        item.createTime = new Date().toISOString();
        this.data.push(item);
        this.save();
        return item;
    },

    update(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updates };
            this.save();
            return this.data[index];
        }
        return null;
    },

    delete(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    },

    search(keyword) {
        if (!keyword) return this.data;
        const lower = keyword.toLowerCase();
        return this.data.filter(item =>
            item.name.toLowerCase().includes(lower) ||
            item.location.toLowerCase().includes(lower) ||
            item.attribute.toLowerCase().includes(lower) ||
            item.type.toLowerCase().includes(lower)
        );
    },

    exists(name, excludeId = null) {
        return this.data.some(item => item.name === name && item.id !== excludeId);
    }
};

// ==================== 库位数据 ====================
const Locations = {
    data: [],

    init() {
        const data = Storage.get('locations_v2');
        if (data && data.length > 0) {
            this.data = data;
        } else {
            // 默认库位数据
            this.data = [
                { id: 1, warehouseName: 'A', locationCode: 'A-01-01', manager: '张三', size: '2m x 1.5m x 1.8m', capacity: '500', remainingCapacity: '320', createTime: new Date().toISOString() },
                { id: 2, warehouseName: 'A', locationCode: 'A-01-02', manager: '张三', size: '2m x 1.5m x 1.8m', capacity: '500', remainingCapacity: '150', createTime: new Date().toISOString() },
                { id: 3, warehouseName: 'B', locationCode: 'B-02-01', manager: '李四', size: '3m x 2m x 2m', capacity: '1000', remainingCapacity: '800', createTime: new Date().toISOString() }
            ];
            this.save();
        }
    },

    save() {
        Storage.set('locations_v2', this.data);
    },

    getAll() {
        return this.data;
    },

    getById(id) {
        return this.data.find(item => item.id === id);
    },

    getByWarehouse(warehouseName) {
        return this.data.filter(item => item.warehouseName === warehouseName);
    },

    add(item) {
        item.id = Date.now();
        item.createTime = new Date().toISOString();
        this.data.push(item);
        this.save();
        return item;
    },

    // 批量添加
    batchAdd(items) {
        const added = [];
        items.forEach(item => {
            item.id = Date.now() + Math.floor(Math.random() * 1000);
            item.createTime = new Date().toISOString();
            this.data.push(item);
            added.push(item);
        });
        this.save();
        return added;
    },

    update(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updates };
            this.save();
            return this.data[index];
        }
        return null;
    },

    delete(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    },

    // 批量删除
    batchDelete(ids) {
        let count = 0;
        ids.forEach(id => {
            const index = this.data.findIndex(item => item.id === id);
            if (index !== -1) {
                this.data.splice(index, 1);
                count++;
            }
        });
        if (count > 0) this.save();
        return count;
    },

    search(keyword) {
        if (!keyword) return this.data;
        const lower = keyword.toLowerCase();
        return this.data.filter(item =>
            (item.locationCode && item.locationCode.toLowerCase().includes(lower)) ||
            (item.warehouseName && item.warehouseName.toLowerCase().includes(lower)) ||
            (item.manager && item.manager.toLowerCase().includes(lower))
        );
    },

    exists(locationCode, warehouseName, excludeId = null) {
        return this.data.some(item =>
            item.locationCode === locationCode &&
            item.warehouseName === warehouseName &&
            item.id !== excludeId
        );
    }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    Inventory.load();
    Flows.init();
    Cart.load();
    Warehouses.init();
    Locations.init();
});
