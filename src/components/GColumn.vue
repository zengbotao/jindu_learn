<script>



export default {
  name: 'GColumn',
  methods: {
    renderTableColumns(columns) {
      // 动态渲染列
      return columns.map((col, i) => {
        // $slots 和 $scopedSlots区别
        // 纯使用外部传递  根据外部插槽调用方法传参给外部
        return this.renderTableCol(col, i);
      });
    },
    renderTableCol(col) {
      // 可以根据字符串传递html结构的内容.生成出来
      let scopedSlots; // undefiend  

      if (col.formatter) {
        scopedSlots = {
          // 箭头函数: JSX的能力 $createElenent无效
          default: function (prop) {
            // 绝大部分使用attrs, 特殊属性使用domProps
            return <div domPropsInnerHTML={ col.formatter(prop)  }></div>
          }
        }
      }



      // default 插槽
      return col.slot ? this.$scopedSlots[col.slot]?.(col) : !col.isHide && (
        <el-table-column
          label={col.label}
          prop={col.prop}
          width={col.width}
          scopedSlots={scopedSlots}
        >
          {
            col.children && col.children.length > 0 &&
            this.renderTableColumns(col.children)
          }
        </el-table-column>
      )
    },
  },
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  render() {
    return this.renderTableCol(this.column)
  }

}

</script>