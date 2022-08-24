<script>
export default {
    name: 'GTable',
    render() {
        // 首列的处理 checkbox 或者index行号
        // 剩余列的处理 = slot
        const { g_pageOptions, showPagination } = this;
        return (
            <div >

                {this.renderTable()}
                {showPagination && this.renderPagination(g_pageOptions)}
            </div>
        )
    },
    methods: {
        handleCurrentChange(page) {
            this.$emit('handleCurrentChange', page);
        },
        renderPagination(options) {
            return (
                <el-pagination
                    onCurrent-change={this.handleCurrentChange}
                    onSize-change={ e=>this.$emit('size-change',e) }
                    attrs={options}
                    layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination >
            )
        },

        // 首列的渲染
        renderIndex() {
            return <el-table-column
                type="index"
                label="序号"
                width="55"
                align="center"
            >
            </el-table-column>
        },
        // 首列的多选
        renderMultiSelect() {
            // 为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
            return <el-table-column
                reserve-selection={true}
                type="selection"
                width="55">
            </el-table-column>
        },
        renderTable() {
            const { columns, loadingTag, g_options, data,
                $store: { state: { loadings } } } = this;
            // jsx中的指令使用v-loading.gbox="true"
            const directives = [
                {
                    name: 'loading',
                    modifiters: {
                        gbox: true
                    },
                    value: loadings[loadingTag]
                },
                {
                    name:'drag'
                }
            ]
            let { useIndex } = g_options;
            let { useMultiSelect } = g_options;
            return (
                <el-table id="gbox"
                    onSelection-change={ e => this.$emit('selection-change',e) }
                    {...{ directives }}
                    data={data} attrs={g_options}>
                    {useIndex && this.renderIndex()}
                    {useMultiSelect && this.renderMultiSelect()}
                    {/* this.renderTableColumns(columns) */}

                    {/* 解决: 通过Column能返回一个元素 */}
                    {columns && columns.map((col, i) => {
                        return <GColumn key={i} column={col} scopedSlots={this.$scopedSlots} />
                    })}


                </el-table>
            )
        }
    },
    computed: {
        // 监视外部属性的改变, 合并本来的配置
        g_options() {
            return Object.assign({}, this.gOptions, this.options)
        },
        g_pageOptions() {
            return Object.assign({}, this.gPageOptions, this.pageOptions)
        }
    },

    data() {
        return {
            // multiSelect:true, // 第一列复选框
            // index:true, // 第一列是行号
            gOptions: {
                stripe: true, // 是否为斑马纹 table	
                border: false, // 是否带有纵向边框	
                fit: true, // 列宽度撑开,
                showHeader: true, // 显示表头
                rowKey: 'id',
                useIndex: true, // 行索引 
                useMultiSelect: false, // 是否多选

            },
            gPageOptions: {
                currentPage: 1,
                pageSizes: [100, 200, 300, 400], // 显示的可切换
                pageSize: 100, // 当前的size
                total: 400, // 总条数
            }
        }
    },
    props: {
        showPagination: {
            type: Boolean,
            default: () => true
        },
        loadingTag: {
            type: String,
            default: () => ''
        },
        options: {
            type: Object,
            default(){
                return this.gOptions;
            }

        },
        pageOptions: {
            type: Object,
            default(){
                return this.gPageOptions;
            }

        },
        data: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style>
</style>