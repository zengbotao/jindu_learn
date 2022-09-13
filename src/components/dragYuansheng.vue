<template>
  <div>
    <div class="draggable-container">
        <div id="draggable" class="draggable" draggable="true">fsdfsdfsdf</div>
        
      </div>
      <div id="droppable" class="droppable"></div>
  </div>
</template>

<script>
        // 1、设置元素可以被拖动draggable="true"
        // 2、dragstart里面利用dataTransfer对象设置想要传递的数据
        // 3、dragover里面阻止浏览器默认事件
        // 4、drop里阻止默认事件，并获取dataTransfer的数据，添加到对应元素的子节点上
        const draggable = document.getElementById("draggable");
      const droppable = document.getElementById("droppable");

      draggable.addEventListener("dragstart", handleDragStart);
      droppable.addEventListener("dragover", handleDragover);
      droppable.addEventListener("dragleave", handleDragLeave);
      droppable.addEventListener("drop", handleDrop);

      function handleDragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
        // 有 copy、move、和 auto 三种，分别是把鼠标指针
        // 显示为复制样式（带+号）、移动样式，或自动设置样式
        // e.dataTransfer.dropEffect = "move";
      }

      function handleDragover(e) {
        e.preventDefault();
        droppable.classList.add("dragover");
        // e.dataTransfer.dropEffect = "move";
      }

      function handleDragLeave(e) {
        droppable.classList.remove("dragover");
      }

      function handleDrop(e) {
        e.preventDefault();
        // 如果是文件
        [...e.dataTransfer.items].forEach((item) => {
          if (item.kind === "file") {
            const file = item.getAsFile();
            createPreview(file);
          }
        });

        // 如果是元素
        const draggedId = e.dataTransfer.getData("text/plain");
        droppable.appendChild(document.getElementById(draggedId));
        droppable.classList.add("dropped");
      }

      function createPreview(imageFile) {
        if (!imageFile.type.startsWith("image/")) {
          return;
        }

        const image = document.createElement("img");
        image.src = URL.createObjectURL(imageFile);
        image.onload = function () {
          URL.revokeObjectURL(this.src);
        };
        droppable.appendChild(image);
      }
export default {

}
</script>

<style>
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    main {
      width: 100vw;
      height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      place-items: center;
      background-color: hsl(0deg, 0%, 10%);
    }

    .draggable-container {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }

    .draggable,
    .droppable {
      border-radius: 4px;
    }

    .draggable {
      width: 25vw;
      height: 25vw;
      background: #00d9ff;
    }

    .droppable {
      width: 30vw;
      height: 30vw;
      border: 8px dashed #00d9ff;
      position: relative;
      display: grid;
      place-items: center;
    }

    .droppable::before {
      display: block;
      content: "请拖放到此区域";
      position: absolute;
      color: white;
      font-family: sans-serif;
      font-size: 3vw;
      color: hsl(0, 0%, 30%);
    }

    .droppable img {
      width: 80%;
      height: 80%;
      object-fit: contain;
    }

    .dragover {
      border: 8px dashed #ffae00;
    }

    .dropped {
      border: 8px dashed #48ff00;
    }
    .dropped::before {
      z-index: -1;
    }
  </style>