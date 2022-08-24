<script>
export default {
    name: 'GFormCreator',
    props: {
        conf: {
            type: Object,
            required: true
        },
        nonCheck:{
            type:Boolean,
            default:()=>false
        }
    },
    data() {
        return {
            form: {} // Vue2中新增属性，默认不是响应式=数据改变+页面变化  => $set
        }
    },
    created() {
        const { items, cards, rules} = this.conf;
        const { nonCheck } = this;

        // 尽量用false属性来增加, 只有新增的东西才多这个true属性
        if (!nonCheck && !rules) throw new Error('看文档,哪个表单不验证啊？')
        this.rulesHandler(rules);
        if (items) {
            this.reaciveFileds(items);
        } else if (cards) {
            cards.forEach(card => {
                if (card.children) {
                    this.reaciveFileds(card.children)
                }
            })
        }
    },

    methods: {
        reaciveFileds(items) {
            items.forEach(rowArr => {
                rowArr.forEach(item => {
                    this.$set(this.form, item.key, item.value)
                })
            });
        },
        rulesHandler(rules) {
            // 改变自定义验证器的this指向， 箭头函数无法被改变
            for (let key in rules) {
                let valArr = rules[key];
                valArr.forEach(item => {
                    if (item.validator) {
                        item.validator = item.validator.bind(this);
                    }
                })
            }
        },
        deepClone(data) {
            return JSON.parse(JSON.stringify(data));
        },
        doSubmit() {
            let { submit } = this.$listeners; // @submit 方式1
            // 需要验证
            this.validate(submit);
            // this.$emit('submit',this.deepClone(this.form)); // 方式2
        },
        validate(fn) {
            // 1. 先验证， 验证通过 调用this.getData()作为参数给fn
            // 2. 验证失败 返回false或者null给外部
            this.$refs.form.validate((valid) => {
                if (valid) {
                    fn(this.getData())
                } else {
                    fn(false);
                }
            })
        },
        getData() {
            return this.deepClone(this.form)
        },
        reset() {
            this.$refs.form.resetFields();
        },
        renderItem(item) {

            switch (item.type) {
                case 'input':
                case 'password':
                case 'textarea':
                    return <el-input attrs={ item.attrs } type={item.type} v-model={this.form[item.key]} ></el-input>
                case 'radio':
                    return item.options.map((opt, i) => {
                        return <el-radio attrs={ item.attrs } key={i} v-model={this.form[item.key]} label={opt.label}>{opt.text}</el-radio>
                    });
                case 'select':
                    return <el-select attrs={item.attrs} v-model={this.form[item.key]} >
                        { item.options.map(opt => {
                            return <el-option
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}>
                            </el-option>
                        })}
                    </el-select>
                case 'datetime':
                    return <el-date-picker
                        v-model={ this.form[item.key] }
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
            }
        },
        renderColums(columns) {
            return columns.map(item => {
                return <el-col
                    xl={item.colspan} lg={item.colspan}
                    md={12} sm={24} xs={24}>
                    <el-form-item label={item.label} prop={item.key}>
                        {this.renderItem(item)}
                    </el-form-item>
                </el-col>
            })
        },
        renderRows(rows) {
            return rows.map(rowArr => {
                return <el-row> {this.renderColums(rowArr)}  </el-row>
            })
        },
        renderCards(cards) {
            return cards.map(card => {
                return (
                    <el-card class="box-card">
                        <div slot="header">
                            <span>{card.name}</span>
                        </div>
                        {card.children && this.renderRows(card.children)}
                    </el-card>
                )
            })
        }
    },
    render(h) {
        // 疯狂解构
        const { title, items, rules, cards } = this.conf;
        const { form } = this;

        // jsx
        return (
            <div class="form-box">
                <h1>{title}</h1>
                {title && <hr />}

                {/* 表单区域: JSX不能直接传递model属性  */}
                <el-form ref="form" attrs={{ model: form }} rules={rules} label-width="80px">

                    {cards ? this.renderCards(cards) : this.renderRows(items)}
                </el-form>

                {/*btns按钮*/}
                <div class="btns clear-fix">
                    { /* 仅仅填DOM */}
                    {this.$slots.default ? this.$slots.default : (

                        <div>
                            <el-button type="primary" onClick={e => this.doSubmit()}>提交</el-button>
                            <el-button onClick={e => this.reset()}>重置</el-button>
                        </div>

                    )}
                    { /* 仅仅填DOM,给父传递参数this.$scopedSlots.default(data) */}

                </div>

            </div>


        )
    }
}
</script>

<style lang="scss" scoped>
.el-select,.el-input {
    width: 100%;
}
.btns {
    text-align: center;
}

.box-card {
    margin-bottom: 10px;
    >div {
        >div {
            text-align: left;
        }
    }
}
</style>