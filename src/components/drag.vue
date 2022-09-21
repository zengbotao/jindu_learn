<template>
    <div id="app" style="padding: 10px">
      <!--使用draggable组件-->
      <div class="itxst">
        <div class="col">
          <div class="title">左侧盒子</div>
          <draggable
            v-model="arr1"
            group="site"
            animation="300"
            dragClass="dragClass"
            @start="onStart"
            @end="onEnd"
          >
          <!-- <draggable
            v-model="arr1"
            group="site"
            animation="300"
            dragClass="dragClass"
            ghostClass="ghostClass"
            chosenClass="chosenClass"
            @start="onStart"
            @end="onEnd"
          > -->
            <transition-group style="display: flex;flex-flow:row wrap;height: 350px;width:500px;background-color: pink;">
              <div class="item" v-for="item in arr1" :key="item.id">{{ item.name }}</div>
            </transition-group>                  
          </draggable>
        </div>
        <div class="col">
          <div class="title">右侧盒子</div>
          <draggable
            v-model="arr2"
            group="site"
            animation="100"
            dragClass="dragClass2"
            ghostClass="ghostClass"
            chosenClass="chosenClass"
            @start="onStart"
            @end="onEnd"
          >
            <transition-group>
              <div class="item" v-for="item in arr2" :key="item.id">{{ item.name }}</div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import draggable from 'vuedraggable'
  export default {
    data() {
      return {
        drag: false,
        arr1: [
          { id: 1, name: '左侧盒子一' },
          { id: 2, name: '左侧盒子二' },
          { id: 3, name: '左侧盒子三' },
          { id: 4, name: '左侧盒子四' }
        ],
         //https://blog.csdn.net/agua001/article/details/122318236
         //使用 transition-group无法拖入一个空数组
         //style="display: flex;height: 100px"注意高度的适配
         //简易的拖拽看板
        arr2: [
          { id: 1, name: '右侧盒子一' },
          { id: 2, name: '右侧盒子二' },
          { id: 3, name: '右侧盒子三' },
          { id: 4, name: '右侧盒子四' }
        ]
      }
    },
    methods: {
      onStart() {
        this.drag = true
      },
      onEnd() {
        this.drag = false
      }
    },
    components: {
      draggable
    }
  }
  </script>
 
  <style lang="scss" scoped>
  .ghostClass {
    background-color: blue !important;
  }
  
  .chosenClass {
    background-color: rgb(12, 88, 150) !important;
    color: white !important;
  }
  
  .dragClass {
    background-color: skyblue !important;
  }
  .dragClass2 {
    background-color: rgb(235, 135, 135) !important;
  }
  .itxst {
    margin: 10px;
    
  }
  
  .title {
    padding: 6px 12px;
  }
  
  .col {
    width: 40%;
    height: 600px;
    background-color: #fff;
    flex: 1;
    padding: 10px;
    border: solid 1px #eee;
    border-radius: 5px;
    float: left;
  }
  
  .col + .col {
    margin-left: 30px;
  }
  //表示选择相邻兄弟，叫做“相邻兄弟选择器”，该选择器能够匹配指定元素后面相邻的兄弟元素。
  .item {
    padding: 6px 12px;
    margin: 0px 10px 0px 10px;
    border: solid 1px #eee;
    background-color: #f1f1f1;
  }
  .col :nth-child(odd){
    width: 250px;
    height: 50px;
  }
  .col :nth-child(even){
    width: 100px;
    height: 50px;
  }
  .item:hover {
    background-color: #fdfdfd;
    cursor: move;
  }
  
  .item {
    border-top: none;
    margin-top: 6px;
  }
  </style>
  