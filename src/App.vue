<template>
  <div class="app-container">
    <h1>人才九宫格生成器</h1>
    <p class="desc">上传一张 Excel（姓名 / 能力 / 潜力），一键生成九宫格人才盘点图。纯本地运行，文件不上传服务器。</p>

    <FileUpload @file-uploaded="processFile" />

    <div v-if="errorMsg" class="error-msg">
      {{ errorMsg }}
    </div>

    <div v-if="stats.parsed > 0" class="stats-msg">
      已解析 <strong>{{ stats.parsed }}</strong> 人<span v-if="stats.skipped > 0">，跳过 {{ stats.skipped }} 行（能力/潜力不是 A/B/C）：{{ stats.skippedNames.join('、') }}{{ stats.skipped > stats.skippedNames.length ? ' 等' : '' }}</span>
    </div>

    <NineGrid v-if="hasData" :data="gridData" />

    <div v-if="!hasData && !errorMsg" class="placeholder-tip">
      <p>请上传 Excel 文件以生成图表</p>
      <p class="sub-tip">格式要求：A 列姓名，B 列能力（A/B/C），C 列潜力（A/B/C）</p>
      <p class="sub-tip">没有现成的表？用仓库 <code>examples/示例数据.xlsx</code> 直接试</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import FileUpload from './components/FileUpload.vue';
import NineGrid from './components/NineGrid.vue';
import { useGridData } from './composables/useGridData';

const { gridData, processFile, errorMsg, stats } = useGridData();

const hasData = computed(() => {
  return Object.values(gridData.value).some(arr => arr.length > 0);
});
</script>

<style scoped>
.app-container {
  width: 100%;
  margin: 0;
  padding: 20px;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}

h1 {
  margin-bottom: 12px;
}

.desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 10px;
}

.error-msg {
  color: #ff4d4f;
  background: #fff1f0;
  border: 1px solid #ffa39e;
  padding: 10px;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 900px;
}

.stats-msg {
  color: #2f855a;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  padding: 8px 10px;
  border-radius: 4px;
  margin: 16px auto 0;
  max-width: 900px;
  font-size: 14px;
}

.placeholder-tip {
  margin-top: 50px;
  color: #999;
}

.sub-tip {
  font-size: 14px;
  margin-top: 10px;
}

code {
  background: #f2f2f2;
  padding: 1px 5px;
  border-radius: 3px;
  color: #444;
}
</style>
