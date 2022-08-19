<template>
  <div class="platformCustomDiv">
    <div class="toolboxDiv">
      <div>
        <div class="page_row">gap</div>
        <div
          class="page_row"
          style="display: flex; justify-content: space-between"
        >
          row
          <input
            type="number"
            step="1"
            v-model="config.rowGap"
            style="flex-grow: 1"
          />(px)
        </div>
        <div
          class="page_row"
          style="display: flex; justify-content: space-between"
        >
          col<input
            type="number"
            step="1"
            v-model="config.columnGap"
            style="flex-grow: 1"
          />(px)
        </div>
      </div>
      <div class="page_row">
        <button class="button primary primary-op" @click="addRow()">
          add row
        </button>
      </div>
      <div>
        <div
          v-for="(item, index) in config.rows"
          :key="index"
          class="page_row centerC"
          style="display: flex; justify-content: space-between"
        >
          <input
            type="number"
            step="0.01"
            v-model="item.value"
            @change="changeItemValue(i)"
            style="flex-grow: 1"
          />
          <select v-model="item.unit" @change="changeItemValue(i)">
            <option value="fr">fr</option>
            <option value="px">px</option>
          </select>
          <i
            nz-icon
            nzType="delete"
            nzTheme="outline"
            @click="deleteRow(i)"
            style="cursor: pointer; margin-left: 10px"
          ></i>
        </div>
      </div>
      <div class="page_row">
        <button class="button primary primary-op" @click="addCol()">
          add col
        </button>
      </div>
      <div>
        <div
          v-for="(item, index) in config.cols"
          class="page_row centerC"
          style="display: flex; justify-content: space-between"
          :key="index"
        >
          <input
            type="number"
            step="0.01"
            v-model="item.value"
            style="flex-grow: 1"
            @change="changeItemValue(i)"
          />
          <select v-model="item.unit" @change="changeItemValue(i)">
            <option value="fr">fr</option>
            <option value="px">px</option>
          </select>
          <i
            nz-icon
            nzType="delete"
            nzTheme="outline"
            @click="deleteCol(i)"
            style="cursor: pointer; margin-left: 10px"
          ></i>
        </div>
      </div>

      <div>
        <div class="page_row">add widget</div>
        <div
          class="oneWidget"
          v-for="(item, index) in config.widgetListOrigin"
          :key="index"
          @mousedown="onAddWidgetDragStart(item)"
        >
          {{ item.name }}
        </div>
      </div>

      <div class="page_row">
        <button class="button primary primary-op" @click="savePlatFromConfig()">
          save
        </button>
      </div>
    </div>
    <div class="cententDiv">
      <div
        class="grid"
        :style="{
          gridTemplateColumns: config.gridtemplatecolumns,
          gridTemplateRows: config.gridtemplaterows,
          rowGap: config.rowGap + 'px',
          columnGap: config.columnGap + 'px',
        }"
      >
        <div
          v-for="(item, index) in config.grids"
          :key="index"
          class="onegrid"
          :class="{
            dropTarget: config.addWidgetPos == item && addWidget == true,
          }"
          @click="onGridClick(item)"
          @pointerenter="pointerover(item)"
        >
          {{ item.row + "," + item.col }}
          <div
            class="colLine"
            @mousedown="ondragStartCol(item)"
            v-if="item.col != config.cols.length"
          ></div>
          <div
            class="rowLine"
            @mousedown="ondragStartRow(item)"
            v-if="item.row != config.rows.length"
          ></div>
        </div>
      </div>

      <div
        class="widgetDiv throw"
        :style="{
          gridTemplateColumns: config.gridtemplatecolumns,
          gridTemplateRows: config.gridtemplaterows,
          rowGap: config.rowGap + 'px',
          columnGap: config.columnGap + 'px',
        }"
      >
        <div
          v-for="(item, index) in config.widgetList"
          :key="index"
          class="widget"
          :class="{ focusWidget: config.focusWidget == item }"
          :style="{ gridArea: getGridArea(item) }"
        >
          <div>id:{{ item.id }}</div>
          <div>{{ item.name }}</div>
          <div v-if="config.focusWidget == item" class="deleteBtn">
            <button @click="deleteWidget(item)">del</button>
          </div>
          <div
            class="widgetColLine nothrow"
            v-if="config.focusWidget == item"
            @mousedown="ondragStartWidget(item, 'topleft')"
          ></div>
          <div
            class="widgetRowLine nothrow"
            v-if="config.focusWidget == item"
            @mousedown="ondragStartWidget(item, 'topleft')"
          ></div>

          <div
            class="widgetColLine nothrow right"
            v-if="config.focusWidget == item"
            @mousedown="ondragStartWidget(item, 'rightbottom')"
          ></div>
          <div
            class="widgetRowLine nothrow bottom"
            v-if="config.focusWidget == item"
            @mousedown="ondragStartWidget(item, 'rightbottom')"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

//获取数据
let config = reactive({
  cols: [
    {
      value: 1,
      unit: "fr",
    },
    {
      value: 1,
      unit: "fr",
    },
  ],
  rows: [
    {
      value: 1,
      unit: "fr",
    },
    {
      value: 1,
      unit: "fr",
    },
  ],
  rowGap: "10",
  columnGap: "10",
  grids: [],
  gridtemplatecolumns: "",
  gridtemplaterows: "",
  widgetListOrigin: [
    {
      name: "组件1",
      tag: "widget-com1",
    },
    {
      name: "组件2",
      tag: "widget-com2",
    },
  ],
  widgetList: [],
  addWidgetPos: { row: 1, col: 1 },
  focusWidget: "",
});
window.aaa = config;

async function savePlatFromConfig() {}
//棋盘事件
let dragPint = {
  x: 0,
  y: 0,
};
let dragging = false;
let dragItem;
let mousemoveY;
let mousemoveX;
function refreshGrid() {
  config.grids = [];
  for (let i = 0; i < config.cols.length * config.rows.length; i++) {
    let col = (i + 1) % config.cols.length || config.cols.length;
    let row = Math.ceil((i + 1) / config.cols.length);
    config.grids.push({ row: row, col: col });
  }
  config.gridtemplatecolumns = config.cols
    .map(function (item) {
      return item.value + item.unit;
    })
    .join(" ");
  config.gridtemplaterows = config.rows
    .map(function (item) {
      return item.value + item.unit;
    })
    .join(" ");
  config.widgetList.forEach((item) => {
    if (item.endCol > config.cols.length + 1) {
      item.endCol = config.cols.length + 1;
    }
    if (item.endRow > config.rows.length + 1) {
      item.endRow = config.rows.length + 1;
    }
  });
}
let t;
function ondragRow(e) {
  let item = dragItem;
  let changeValue;
  if (config.rows[item.row - 1].unit == "px") {
    changeValue = 3;
  } else if (config.rows[item.row - 1].unit == "fr") {
    changeValue = 0.1;
  }
  if (dragPint.y - event.clientY < 0) {
    // if(config.rows[item.row].value -changeValue <= changeValue){
    //     return false;
    // }
    config.rows[item.row - 1].value = Number(
      Number(config.rows[item.row - 1].value + changeValue).toFixed(1)
    );
    if (
      config.rows[item.row].unit == "fr" &&
      config.rows[item.row].unit == config.rows[item.row - 1].unit
    ) {
      config.rows[item.row].value = Number(
        Number(config.rows[item.row].value - changeValue).toFixed(1)
      );
    }
  } else {
    // if (config.rows[item.row - 1].value -changeValue <=changeValue) {
    //     return false;
    // }
    config.rows[item.row - 1].value = Number(
      Number(config.rows[item.row - 1].value - changeValue).toFixed(1)
    );
    if (
      config.rows[item.row].unit == "fr" &&
      config.rows[item.row].unit == config.rows[item.row - 1].unit
    ) {
      config.rows[item.row].value = Number(
        Number(config.rows[item.row].value + changeValue).toFixed(1)
      );
    }
  }
  refreshGrid();
}
function ondragStartRow(item, e) {
  dragItem = item;
  let per =
    event.currentTarget.parentNode.clientHeight /
    config.rows[dragItem.row - 1].value;

  dragging = true;
  dragPint.x = event.clientX;
  dragPint.y = event.clientY;
  mousemoveX =  ()=> {
    let movement = Math.abs(dragPint.y - event.clientY);
    if (movement > per / 10) {
      ondragRow(event);
      dragPint.x = event.clientX;
      dragPint.y = event.clientY;
    }
  }
  document.addEventListener("mousemove", mousemoveX);

  let mouseup =  ()=> {
    dragging = false;
    dragPint.x = 0;
    dragPint.y = 0;
    document.removeEventListener("mousemove", mousemoveX);
    document.removeEventListener("mousemove", mousemoveY);
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener("mouseleave", mouseup);
  }
  document.addEventListener("mouseup", mouseup);
  document.addEventListener("mouseleave", mouseup);
  //屏蔽drag
  event.stopPropagation();
  event.preventDefault();
}
function ondragCol(e) {
  let item = dragItem;
  let changeValue;
  if (config.cols[item.col - 1].unit == "px") {
    changeValue = 3;
  } else if (config.cols[item.col - 1].unit == "fr") {
    changeValue = 0.1;
  }
  if (dragPint.x - event.clientX < 0) {
    config.cols[item.col - 1].value = Number(
      Number(config.cols[item.col - 1].value + changeValue).toFixed(1)
    );
    if (
      config.cols[item.col].unit == "fr" &&
      config.cols[item.col].unit == config.cols[item.col - 1].unit
    ) {
      config.cols[item.col].value = Number(
        Number(config.cols[item.col].value - changeValue).toFixed(1)
      );
    }
  } else {
    config.cols[item.col - 1].value = Number(
      Number(config.cols[item.col - 1].value - changeValue).toFixed(1)
    );
    if (
      config.cols[item.col].unit == "fr" &&
      config.cols[item.col].unit == config.cols[item.col - 1].unit
    ) {
      config.cols[item.col].value = Number(
        Number(config.cols[item.col].value + changeValue).toFixed(1)
      );
    }
  }
  refreshGrid();
}

function ondragStartCol(item, e) {
  dragItem = item;
  let per =
    event.currentTarget.parentNode.clientWidth /
    config.cols[dragItem.col - 1].value;

  dragging = true;
  dragPint.x = event.clientX;
  dragPint.y = event.clientY;
  mousemoveY =  (e)=> {
    let movement = Math.abs(dragPint.x - event.clientX);
    if (movement > per / 10) {
      ondragCol(e);
      dragPint.x = event.clientX;
      dragPint.y = event.clientY;
    }
  }
  document.addEventListener("mousemove", mousemoveY);
  let mouseup =  () =>{
    dragging = false;
    dragPint.x = 0;
    dragPint.y = 0;
    document.removeEventListener("mousemove", mousemoveX);
    document.removeEventListener("mousemove", mousemoveY);
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener("mouseleave", mouseup);
  }
  document.addEventListener("mouseup", mouseup);
  document.addEventListener("mouseleave", mouseup);
  //屏蔽drag
  event.stopPropagation();
  event.preventDefault();
}
function addRow() {
  config.rows.push({
    value: 1,
    unit: "fr",
  });
  refreshGrid();
}
function deleteRow(index) {
  config.rows.splice(index, 1);
  refreshGrid();
}

function addCol() {
  config.cols.push({
    value: 1,
    unit: "fr",
  });
  refreshGrid();
}
function deleteCol(index) {
  config.cols.splice(index, 1);
  refreshGrid();
}
function changeColValue(index, e) {
  config.cols[index].value = Number(event.target.value);
  refreshGrid();
}
function changeRowValue(index, e) {
  config.rows[index].value = Number(event.target.value);
  refreshGrid();
}
function changeItemValue(index, e) {
  refreshGrid();
}
//widget事件
let widgetIndex = 0;
let addWidget = false;
function onAddWidgetDragStart(item, e) {
  addWidget = true;

  let mouseup =  ()=> {
    addWidget = false;
    config.widgetList.push({
      startRow: config.addWidgetPos.row,
      startCol: config.addWidgetPos.col,
      endRow: config.addWidgetPos.row + 1,
      endCol: config.addWidgetPos.col + 1,
      name: item.name,
      tag: item.tag,
      id: "widget_" + widgetIndex,
    });
    widgetIndex++;
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener("mouseleave", mouseup);
  }
  document.addEventListener("mouseup", mouseup);
  document.addEventListener("mouseleave", mouseup);
  event.stopPropagation();
  event.preventDefault();
}
function deleteWidget(item) {
  config.widgetList.splice(config.widgetList.indexOf(item), 1);
}
function onGridClick(item, e) {
  config.focusWidget = null;
  config.widgetList.forEach((widget) => {
    if (
      widget.startRow <= item.row &&
      widget.endRow - 1 >= item.row &&
      widget.startCol <= item.col &&
      widget.endCol - 1 >= item.col
    ) {
      config.focusWidget = widget;
    }
  });
}
let dragWidget = false;
let dragType = "topleft";
function ondragStartWidget(item, flg) {
  dragType = flg;
  dragWidget = true;
  let mouseup = () => {
    dragWidget = false;
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener("mouseleave", mouseup);
  };
  document.addEventListener("mouseup", mouseup);
  document.addEventListener("mouseleave", mouseup);
  event.stopPropagation();
  event.preventDefault();
}
function getGridArea(item) {
  return `${item.startRow}/${item.startCol}/${item.endRow}/${item.endCol}`;
}
function pointerover(item, e) {
  if (dragWidget == true) {
    if (config.focusWidget) {
      if (dragType == "topleft") {
        if (
          item.row <= config.focusWidget.endRow &&
          item.col <= config.focusWidget.endCol
        ) {
          config.focusWidget.startRow = item.row;
          config.focusWidget.startCol = item.col;
        }
      }

      if (dragType == "rightbottom") {
        if (
          item.row >= config.focusWidget.startRow &&
          item.col >= config.focusWidget.startCol
        ) {
          config.focusWidget.endRow = item.row + 1;
          config.focusWidget.endCol = item.col + 1;
        }
      }
    }
  }
  if (addWidget == true) {
    config.addWidgetPos = item;
  }
}

onMounted(() => {
  refreshGrid();
});
</script>

<style scoped>
.platformCustomDiv {
  height: 100%;
  width: 100%;
  display: flex;
}
.toolboxDiv {
  width: 300px;
  flex-basis: 300px;
  background-color: white;
  border-right: 1px solid #aaa;
  box-shadow: var(--box-shadow);
  z-index: 1;
  padding: 10px;
}
.cententDiv {
  flex-grow: 1;
}
.grid {
  display: grid;
  background: white;
  height: 100%;
  width: 100%;
}
.widgetDiv {
  display: grid;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.widget {
  background-color: rgb(32 178 170 / 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.config.focusWidget {
}
.onegrid {
  position: relative;
  background-color: #eee;
}

.throw {
  pointer-events: none;
}
.nothrow {
  pointer-events: auto;
}
.colLine {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 5px;
  cursor: col-resize;
}
.rowLine {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 5px;
  cursor: row-resize;
}
.widgetColLine {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 5px;
  cursor: move;
  background-color: var(--color-primary);
}
.widgetRowLine {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 5px;
  cursor: move;
  background-color: var(--color-primary);
}
.right {
  right: 0;
  left: auto;
}
.bottom {
  bottom: 0;
  top: auto;
}
.oneWidget {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary);
  cursor: move;
  padding: 10px;
  margin-bottom: 10px;
}
.dropTarget {
  background-color: rgb(32 178 170 / 30%);
}
.deleteBtn {
  position: absolute;
  right: 10px;
  top: 10px;
  color: red;
  cursor: pointer;
  pointer-events: auto;
}
</style>
