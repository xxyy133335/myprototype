/**
 * myPrototype 公共函数库
 * 江森自控 (Johnson Controls) - 仓储与试制管理系统
 */

// ==================== Toast 提示系统 ====================
const Toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', title = '', duration = 2500) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconMap = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${iconMap[type]}"></i>
            </div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="Toast.dismiss(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(toast);
        
        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(toast.querySelector('.toast-close'));
            }, duration);
        }
        
        return toast;
    },
    
    success(message, title = '操作成功') {
        return this.show(message, 'success', title);
    },
    
    error(message, title = '操作失败') {
        return this.show(message, 'error', title);
    },
    
    warning(message, title = '警告') {
        return this.show(message, 'warning', title);
    },
    
    info(message, title = '提示') {
        return this.show(message, 'info', title);
    },
    
    dismiss(btn) {
        const toast = btn.closest('.toast');
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
};

// ==================== Modal 模态框系统 ====================
const Modal = {
    open(content, options = {}) {
        const { size = '', title = '', showClose = true, onClose = null } = options;
        
        // 创建遮罩层
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const sizeClass = size ? `modal-${size}` : '';
        
        modal.innerHTML = `
            <div class="modal-dialog ${sizeClass}">
                ${title ? `
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        ${showClose ? `<button class="modal-close" onclick="Modal.close(this)"><i class="fas fa-times"></i></button>` : ''}
                    </div>
                ` : ''}
                <div class="modal-body">
                    ${typeof content === 'string' ? content : ''}
                </div>
            </div>
        `;
        
        // 如果 content 是 DOM 元素，追加到 body
        if (typeof content !== 'string' && content instanceof HTMLElement) {
            modal.querySelector('.modal-body').appendChild(content);
        }
        
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        
        // 存储关闭回调
        modal._onClose = onClose;
        
        // 点击遮罩层关闭
        backdrop.addEventListener('click', () => {
            this.close(modal.querySelector('.modal-close') || modal);
        });
        
        // 动画显示
        requestAnimationFrame(() => {
            backdrop.classList.add('show');
            modal.classList.add('show');
        });
        
        // ESC 键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close(modal.querySelector('.modal-close') || modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        return modal;
    },
    
    close(btn) {
        const modal = btn.closest('.modal');
        const backdrop = modal.previousElementSibling;
        
        modal.classList.remove('show');
        backdrop.classList.remove('show');
        
        setTimeout(() => {
            if (modal._onClose) modal._onClose();
            modal.remove();
            backdrop.remove();
        }, 300);
    },
    
    confirm(message, onConfirm, onCancel = null) {
        const content = `
            <div class="text-center" style="padding: 20px 0;">
                <div style="width: 64px; height: 64px; background: var(--jc-warning-orange-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas fa-question" style="font-size: 28px; color: var(--jc-warning-orange);"></i>
                </div>
                <p style="font-size: 16px; color: var(--jc-text-dark); margin-bottom: 24px;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="btn btn-secondary" onclick="Modal.close(this); ${onCancel ? 'window._modalCancelCallback()' : ''}">取消</button>
                    <button class="btn btn-primary" onclick="Modal.close(this); window._modalConfirmCallback()">确认</button>
                </div>
            </div>
        `;
        
        window._modalConfirmCallback = () => {
            if (onConfirm) onConfirm();
            delete window._modalConfirmCallback;
            delete window._modalCancelCallback;
        };
        
        window._modalCancelCallback = () => {
            if (onCancel) onCancel();
            delete window._modalConfirmCallback;
            delete window._modalCancelCallback;
        };
        
        return this.open(content, { size: 'sm' });
    },
    
    alert(message, type = 'info', onClose = null) {
        const iconMap = {
            success: { icon: 'fa-check', color: 'var(--jc-success-green)', bg: 'var(--jc-success-green-light)' },
            error: { icon: 'fa-times', color: 'var(--jc-danger-red)', bg: 'var(--jc-danger-red-light)' },
            warning: { icon: 'fa-exclamation', color: 'var(--jc-warning-orange)', bg: 'var(--jc-warning-orange-light)' },
            info: { icon: 'fa-info', color: 'var(--jc-accent-teal)', bg: 'var(--jc-accent-teal-light)' }
        };
        
        const { icon, color, bg } = iconMap[type];
        
        const content = `
            <div class="text-center" style="padding: 20px 0;">
                <div style="width: 64px; height: 64px; background: ${bg}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas ${icon}" style="font-size: 28px; color: ${color};"></i>
                </div>
                <p style="font-size: 16px; color: var(--jc-text-dark); margin-bottom: 24px;">${message}</p>
                <button class="btn btn-primary" onclick="Modal.close(this); window._modalAlertCallback && window._modalAlertCallback()">确定</button>
            </div>
        `;
        
        if (onClose) {
            window._modalAlertCallback = () => {
                onClose();
                delete window._modalAlertCallback;
            };
        }
        
        return this.open(content, { size: 'sm' });
    }
};

// ==================== 表单处理 ====================
const FormUtils = {
    // 序列化表单数据
    serialize(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    },
    
    // 填充表单数据
    fill(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = Boolean(data[key]);
                } else if (field.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    field.value = data[key];
                }
            }
        });
    },
    
    // 重置表单
    reset(form) {
        form.reset();
        // 清除错误状态
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.form-error').forEach(el => el.remove());
    },
    
    // 设置字段错误
    setFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // 移除已有错误提示
        const existingError = field.parentElement.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // 添加错误提示
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
        
        if (field.parentElement.classList.contains('form-group')) {
            field.parentElement.appendChild(errorEl);
        } else {
            field.parentElement.insertBefore(errorEl, field.nextSibling);
        }
    },
    
    // 清除字段错误
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.remove();
    },
    
    // 清除所有错误
    clearAllErrors(form) {
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.form-error').forEach(el => el.remove());
    }
};

// ==================== 按钮状态管理 ====================
const ButtonUtils = {
    // 设置加载状态
    setLoading(btn, text = '处理中...') {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        btn.disabled = true;
        btn.classList.add('btn-loading');
    },
    
    // 恢复按钮状态
    reset(btn) {
        if (btn.dataset.originalText) {
            btn.innerHTML = btn.dataset.originalText;
        }
        btn.disabled = false;
        btn.classList.remove('btn-loading');
    },
    
    // 设置成功状态
    setSuccess(btn, text = '成功') {
        btn.innerHTML = `<i class="fas fa-check"></i> ${text}`;
        btn.classList.add('btn-success');
        setTimeout(() => {
            this.reset(btn);
            btn.classList.remove('btn-success');
        }, 2000);
    }
};

// ==================== Tab 切换 ====================
const TabUtils = {
    init(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const tabs = container.querySelectorAll('.tab-item');
        const contents = container.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // 移除所有激活状态
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // 激活当前
                tab.classList.add('active');
                if (contents[index]) {
                    contents[index].classList.add('active');
                }
                
                // 触发自定义事件
                tab.dispatchEvent(new CustomEvent('tab:change', { 
                    detail: { index, tab, content: contents[index] }
                }));
            });
        });
    },
    
    switchTo(containerSelector, index) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const tabs = container.querySelectorAll('.tab-item');
        if (tabs[index]) {
            tabs[index].click();
        }
    }
};

// ==================== 表格工具 ====================
const TableUtils = {
    // 渲染表格
    render(tableSelector, data, columns, options = {}) {
        const table = document.querySelector(tableSelector);
        if (!table) return;
        
        const { emptyText = '暂无数据', actions = null } = options;
        
        const tbody = table.querySelector('tbody') || table;
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            const colSpan = columns.length + (actions ? 1 : 0);
            tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center" style="padding: 40px; color: var(--jc-text-muted);">${emptyText}</td></tr>`;
            return;
        }
        
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            columns.forEach(col => {
                const td = document.createElement('td');
                
                if (typeof col.render === 'function') {
                    td.innerHTML = col.render(row[col.key], row, index);
                } else {
                    td.textContent = row[col.key] || '-';
                }
                
                tr.appendChild(td);
            });
            
            if (actions) {
                const td = document.createElement('td');
                td.className = 'table-actions';
                td.innerHTML = actions(row, index);
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        });
    },
    
    // 排序
    sort(data, key, order = 'asc') {
        return [...data].sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }
};

// ==================== 本地存储工具 ====================
const Storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    get(key, defaultValue = null) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// ==================== 日期时间工具 ====================
const DateUtils = {
    format(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    now(format = 'YYYY-MM-DD HH:mm:ss') {
        return this.format(new Date(), format);
    },
    
    addDays(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    },
    
    diffDays(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diff = d2 - d1;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
};

// ==================== 防抖节流 ====================
function debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化下拉菜单
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.dropdown');
            dropdown.classList.toggle('show');
        });
    });
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.show').forEach(d => {
            d.classList.remove('show');
        });
    });
    
    // 初始化 Tab
    document.querySelectorAll('.tabs').forEach((tabs, index) => {
        TabUtils.init(`.tabs:nth-of-type(${index + 1})`);
    });
});
