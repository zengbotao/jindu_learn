export default { // 自定义的,就是为了和外部交互
    name:'drag',
    handler:{
        unbind:function(el){
            let target = el.getElementsByClassName('el-table__body-wrapper')[0];
            target.onmousedown = null;
        },
                        //元素 修饰符与数据等 当前元素是虚拟Node
        inserted:function(el,binding,vnode){
            let target = el.getElementsByClassName('el-table__body-wrapper')[0];
            // 横向超出不显示滚动条
            target.style.overflowX = 'hidden';
            // 显示一只小手
            target.style.cursor = 'grab';
            // 鼠标按下  clientX相對容器的x
            target.onmousedown = function(event) {
                // 记录鼠标初始点
                let startPointX = event.clientX;
                // 获取初始的scrollLeft值,后续在其基础上增加
                let startScrollLeft = target.scrollLeft; // 最开始是0,后续要累加
                // 需要记录document的移动
                // 超出元素移动就有问题 => document的移动
                document.onmousemove = function(e){
                    // 移动到的位置 - 初始的点的位置, 差异
                    let x = e.clientX - startPointX; // 20
                    // 在原来的基础上继续减
                    target.scrollLeft = startScrollLeft - x;
                }
                // 防止用户超出当前元素 放开鼠标, 触发事件
                document.onmouseup = function() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }


        }
    }

}