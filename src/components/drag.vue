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
            ghostClass="ghostClass"
            chosenClass="chosenClass"
            @start="onStart"
            @end="onEnd"
          >
            <transition-group>
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
            dragClass="dragClass"
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
    background-color: black !important;
    color: white !important;
  }
  
  .dragClass {
    background-color: skyblue !important;
  }
  
  .itxst {
    margin: 10px;
  }
  
  .title {
    padding: 6px 12px;
  }
  
  .col {
    width: 40%;
    background-color: #fff;
    flex: 1;
    padding: 10px;
    border: solid 1px #eee;
    border-radius: 5px;
    float: left;
  }
  
  .col + .col {
    margin-left: 10px;
  }
  .item {
    padding: 6px 12px;
    margin: 0px 10px 0px 10px;
    border: solid 1px #eee;
    background-color: #f1f1f1;
  }
  
  .item:hover {
    background-color: #fdfdfd;
    cursor: move;
  }
  
  .item + .item {
    border-top: none;
    margin-top: 6px;
  }
  </style>
  