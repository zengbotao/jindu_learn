
import dragTable from "./dragTable"
function install(Vue) {
    Vue.directive(dragTable.name,dragTable.handler)
}


export default {
    install
}