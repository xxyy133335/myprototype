/**
 * myPrototype 表单验证库
 * 江森自控 (Johnson Controls) - 仓储与试制管理系统
 */

const Validation = {
    // 验证规则
    rules: {
        // 必填
        required(value, field) {
            const isEmpty = value === null || value === undefined || value.toString().trim() === '';
            return {
                valid: !isEmpty,
                message: isEmpty ? `${field.label || '该字段'}不能为空` : null
            };
        },
        
        // 最小长度
        minLength(value, field, length) {
            if (!value) return { valid: true, message: null };
            const valid = value.toString().length >= length;
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}至少需要${length}个字符`
            };
        },
        
        // 最大长度
        maxLength(value, field, length) {
            if (!value) return { valid: true, message: null };
            const valid = value.toString().length <= length;
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}最多${length}个字符`
            };
        },
        
        // 最小值
        min(value, field, min) {
            if (!value && value !== 0) return { valid: true, message: null };
            const num = parseFloat(value);
            const valid = !isNaN(num) && num >= min;
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}最小值为${min}`
            };
        },
        
        // 最大值
        max(value, field, max) {
            if (!value && value !== 0) return { valid: true, message: null };
            const num = parseFloat(value);
            const valid = !isNaN(num) && num <= max;
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}最大值为${max}`
            };
        },
        
        // 邮箱
        email(value, field) {
            if (!value) return { valid: true, message: null };
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const valid = pattern.test(value);
            return {
                valid,
                message: valid ? null : '请输入有效的邮箱地址'
            };
        },
        
        // 手机号
        phone(value, field) {
            if (!value) return { valid: true, message: null };
            const pattern = /^1[3-9]\d{9}$/;
            const valid = pattern.test(value);
            return {
                valid,
                message: valid ? null : '请输入有效的手机号码'
            };
        },
        
        // 数字
        number(value, field) {
            if (!value && value !== 0) return { valid: true, message: null };
            const valid = !isNaN(parseFloat(value)) && isFinite(value);
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}必须是数字`
            };
        },
        
        // 整数
        integer(value, field) {
            if (!value && value !== 0) return { valid: true, message: null };
            const valid = Number.isInteger(Number(value));
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}必须是整数`
            };
        },
        
        // 正数
        positive(value, field) {
            if (!value && value !== 0) return { valid: true, message: null };
            const num = parseFloat(value);
            const valid = !isNaN(num) && num > 0;
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}必须大于0`
            };
        },
        
        // 正则表达式
        pattern(value, field, regex, message) {
            if (!value) return { valid: true, message: null };
            const valid = regex.test(value);
            return {
                valid,
                message: valid ? null : (message || '格式不正确')
            };
        },
        
        // 大写字母
        uppercase(value, field) {
            if (!value) return { valid: true, message: null };
            const pattern = /^[A-Z]+$/;
            const valid = pattern.test(value);
            return {
                valid,
                message: valid ? null : `${field.label || '该字段'}必须为大写字母`
            };
        },

        // 自定义验证
        custom(value, field, validator) {
            return validator(value, field);
        }
    },
    
    // 验证单个字段
    validateField(field, rules) {
        const value = field.type === 'checkbox' ? field.checked : field.value;
        const fieldConfig = {
            label: field.dataset.label || field.placeholder || field.name,
            name: field.name
        };
        
        for (let rule of rules) {
            let ruleName, ruleParams;
            
            if (typeof rule === 'string') {
                ruleName = rule;
                ruleParams = [];
            } else if (Array.isArray(rule)) {
                ruleName = rule[0];
                ruleParams = rule.slice(1);
            } else {
                ruleName = rule.rule;
                ruleParams = rule.params || [];
            }
            
            if (this.rules[ruleName]) {
                const result = this.rules[ruleName](value, fieldConfig, ...ruleParams);
                if (!result.valid) {
                    return result;
                }
            }
        }
        
        return { valid: true, message: null };
    },
    
    // 验证表单
    validate(form, config) {
        const errors = [];
        let firstInvalidField = null;
        
        // 清除之前的错误
        FormUtils.clearAllErrors(form);
        
        for (let fieldName in config) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;
            
            const rules = config[fieldName];
            const result = this.validateField(field, rules);
            
            if (!result.valid) {
                errors.push({
                    field: fieldName,
                    element: field,
                    message: result.message
                });
                
                FormUtils.setFieldError(field, result.message);
                
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }
        
        // 聚焦第一个错误字段
        if (firstInvalidField) {
            firstInvalidField.focus();
            // 添加震动效果（如果是登录表单）
            if (form.classList.contains('login-form')) {
                form.classList.add('shake');
                setTimeout(() => form.classList.remove('shake'), 500);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    },
    
    // 实时验证
    attachRealtimeValidation(form, config) {
        for (let fieldName in config) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;
            
            field.addEventListener('input', debounce(() => {
                const rules = config[fieldName];
                const result = this.validateField(field, rules);
                
                if (!result.valid) {
                    FormUtils.setFieldError(field, result.message);
                } else {
                    FormUtils.clearFieldError(field);
                }
            }, 300));
            
            // 失去焦点时也验证
            field.addEventListener('blur', () => {
                const rules = config[fieldName];
                const result = this.validateField(field, rules);
                
                if (!result.valid) {
                    FormUtils.setFieldError(field, result.message);
                } else {
                    FormUtils.clearFieldError(field);
                }
            });
        }
    }
};

// ==================== 业务验证规则 ====================
const BusinessValidation = {
    // 验证领用数量不超过剩余库存
    validateOutboundQuantity(input, maxStock) {
        const value = parseFloat(input.value);
        if (isNaN(value) || value <= 0) {
            return { valid: false, message: '请输入有效的领用数量' };
        }
        if (value > maxStock) {
            return { valid: false, message: `领用数量不能超过剩余库存 (${maxStock})` };
        }
        return { valid: true, message: null };
    },
    
    // 验证购物车合并后数量
    validateCartAddition(cart, materialId, addQuantity, maxStock) {
        const existingItem = cart.find(item => item.materialId === materialId);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const totalQty = currentQty + addQuantity;
        
        if (totalQty > maxStock) {
            return {
                valid: false,
                message: `合并后数量 (${totalQty}) 超过剩余库存 (${maxStock})`
            };
        }
        
        return { valid: true, message: null };
    },
    
    // 验证物料编号必填（根据物料类别）
    validateMaterialCode(materialCategory, materialCode) {
        const requiredCategories = ['室外机', '室内机', '压缩机', '控制箱'];
        
        if (requiredCategories.includes(materialCategory)) {
            if (!materialCode || materialCode.trim() === '') {
                return {
                    valid: false,
                    message: '该物料类别必须填写物料编号'
                };
            }
        }
        
        return { valid: true, message: null };
    },
    
    // 动态设置物料编号必填状态
    setMaterialCodeRequired(selectElement, codeInputElement) {
        const requiredCategories = ['室外机', '室内机', '压缩机', '控制箱'];
        
        const updateRequired = () => {
            const category = selectElement.value;
            const isRequired = requiredCategories.includes(category);
            
            if (isRequired) {
                codeInputElement.setAttribute('required', 'required');
                codeInputElement.dataset.label = codeInputElement.dataset.label || '物料编号';
                
                // 添加必填标记
                const label = codeInputElement.closest('.form-group')?.querySelector('.form-label');
                if (label && !label.querySelector('.required-mark')) {
                    label.innerHTML += '<span class="required-mark">*</span>';
                }
                
                // 修改 placeholder
                codeInputElement.placeholder = '请输入物料编号（必填）';
            } else {
                codeInputElement.removeAttribute('required');
                
                // 移除必填标记
                const label = codeInputElement.closest('.form-group')?.querySelector('.form-label');
                if (label) {
                    const mark = label.querySelector('.required-mark');
                    if (mark) mark.remove();
                }
                
                codeInputElement.placeholder = '请输入物料编号（选填）';
                
                // 清除错误状态
                FormUtils.clearFieldError(codeInputElement);
            }
        };
        
        selectElement.addEventListener('change', updateRequired);
        updateRequired(); // 初始状态
    },
    
    // 验证文件类型
    validateFileType(file, allowedTypes) {
        const extension = file.name.split('.').pop().toLowerCase();
        const allowed = allowedTypes.map(t => t.toLowerCase());
        
        if (!allowed.includes(extension)) {
            return {
                valid: false,
                message: `不支持的文件格式，请上传 ${allowedTypes.join(', ')} 格式的文件`
            };
        }
        
        return { valid: true, message: null };
    },
    
    // 验证文件大小
    validateFileSize(file, maxSizeMB) {
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            return {
                valid: false,
                message: `文件大小不能超过 ${maxSizeMB}MB`
            };
        }
        return { valid: true, message: null };
    }
};

// ==================== 快捷验证配置 ====================
const ValidationSchemas = {
    // 登录表单
    login: {
        username: ['required'],
        password: ['required', ['minLength', 6]]
    },
    
    // 仓管员入库
    keeperInbound: {
        materialName: ['required'],
        materialCode: {
            rule: 'custom',
            params: [(value, field) => {
                // 动态验证，根据物料类别判断
                return { valid: true, message: null };
            }]
        },
        projectCode: ['required'],
        pbu: ['required'],
        exempt3C: ['required'],
        materialCategory: ['required'],
        owner: ['required'],
        department: ['required'],
        poNumber: ['required'],
        quantity: ['required', 'positive', 'number'],
        unit: ['required'],
        warehouse: ['required'],
        location: ['required'],
        unitPrice: ['required', 'positive', 'number']
    },
    
    // 工程师入库
    engineerInbound: {
        materialName: ['required'],
        projectCode: ['required'],
        pbu: ['required'],
        exempt3C: ['required'],
        poNumber: ['required'],
        quantity: ['required', 'positive', 'number'],
        unit: ['required'],
        unitPrice: ['required', 'positive', 'number']
    },
    
    // 领用出库
    outbound: {
        reason: ['required', ['minLength', 5]]
    },
    
    // 报废出库
    scrapOutbound: {
        attachments: ['required']
    },
    
    // 移库
    transfer: {
        targetWarehouse: ['required'],
        targetLocation: ['required']
    },
    
    // 快递发运 - 工程师
    expressEngineer: {
        materialDesc: ['required'],
        shipReason: ['required'],
        shipPackage: ['required'],
        recipient: ['required'],
        recipientPhone: ['required', 'phone'],
        address: ['required'],
        costCenter: ['required']
    },
    
    // 快递发运 - 仓管员
    expressKeeper: {
        trackingNumber: ['required'],
        weight: ['required', 'positive', 'number'],
        pieces: ['required', 'positive', 'integer'],
        amount: ['required', 'positive', 'number']
    },

    // 仓库管理
    warehouse: {
        warehouseName: ['required', 'uppercase'],
        warehouseLocation: ['required'],
        warehouseAttribute: ['required'],
        warehouseType: ['required']
    },

    // 库位管理
    location: {
        locationCode: ['required'],
        locationWarehouse: ['required'],
        locationManager: ['required'],
        locationSize: ['required'],
        locationCapacity: ['required', 'positive', 'number'],
        locationRemaining: ['required', 'number']
    }
};
