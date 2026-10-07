<template>
  <div class="file-upload">
    <div 
      class="drop-zone" 
      @dragover.prevent 
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <p v-if="!fileName">点击或拖拽 Excel 文件到此处 (A列:姓名, B:能力, C:潜力)</p>
      <p v-else class="file-name">已选择: {{ fileName }}</p>
      <input 
        type="file" 
        ref="fileInput" 
        hidden 
        accept=".xlsx, .xls" 
        @change="handleFileChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['file-uploaded']);
const fileInput = ref(null);
const fileName = ref('');

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFile = (file) => {
  if (file) {
    fileName.value = file.name;
    emit('file-uploaded', file);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  handleFile(file);
};

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0];
  handleFile(file);
};
</script>

<style scoped lang="scss">
.file-upload {
  margin: 20px 0;
  .drop-zone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fafafa;
    color: #666;

    &:hover {
      border-color: #42b983; // Vue Green
      background-color: #f0fdf4;
    }
    
    .file-name {
      color: #333;
      font-weight: bold;
    }
  }
}
</style>
