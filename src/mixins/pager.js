export default {
    data(){
        return {
            // 前端的东西
            currentPage: 1,
            pageSizes: [10, 20, 30, 40], // 显示的可切换
            pageSize: 10, // 当前的size
            total: 0, // 总条数
            query:'', // 查询条件
        }
    },
    computed:{
        frontPageOptions(){
            return {
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                pageSizes:this.pageSizes,
                query:this.query,
                total:this.total
            }
        }
    },
    methods: {
        // 提供后端数据访问的参数
        getApiPager(){
            let params =  {
                pageNo:this.currentPage,
                pageSize:this.pageSize,
            }
            if (this.query && this.query.trim() !== "") {
                params.name = this.query;
            }
            return params;
        },
        setTotal(total){
            this.total = total;
        },
        // name的改变
        setQueryName(q) {
            this.query = q;
            this.currentPage = 1;
            this.init();
        },
        // pageSize的改变, 页显示数
        sizeChange(size) {
           this.pageSize = size;
           this.init();
        },
        // 当前页的改变
        currentPageChange(page) {
            this.currentPage = page;
            this.init();
        },
    }
}