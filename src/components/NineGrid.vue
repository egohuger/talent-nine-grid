<template>
  <div class="nine-grid-container">
    <!-- Controls -->
    <div class="controls">
      <div class="control-group">
        <label>横向缩放 (Width):</label>
        <input type="range" min="0.5" max="3" step="0.1" v-model.number="scaleX" />
        <span>{{ (scaleX * 100).toFixed(0) }}%</span>
      </div>
      <div class="control-group">
        <label>纵向缩放 (Height):</label>
        <input type="range" min="0.5" max="3" step="0.1" v-model.number="scaleY" />
        <span>{{ (scaleY * 100).toFixed(0) }}%</span>
      </div>
      <div class="control-group">
        <label>人名大小:</label>
        <input type="range" min="10" max="30" step="1" v-model.number="nameFontSize" />
        <span>{{ nameFontSize }}px</span>
      </div>
      <button class="toggle-btn" @click="showSettings = !showSettings">
        {{ showSettings ? '收起配色设置' : '展开配色设置' }}
      </button>
    </div>

    <!-- Style Settings Panel -->
    <div v-if="showSettings" class="settings-panel">
      <h3>宫格配色与透明度设置 (位置对应下方九宫格)</h3>
      <div class="settings-grid">
        <div v-for="key in settingsOrder" :key="key" class="setting-item">
          <span class="setting-label">{{ cellLabels[key] }}</span>
          <div class="setting-inputs">
            <input type="color" v-model="cellStyles[key].bg" />
            <div class="opacity-control">
              <label>不透明度: {{ cellStyles[key].opacity }}</label>
              <input type="range" min="0" max="1" step="0.1" v-model.number="cellStyles[key].opacity" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Title Input -->
    <div class="header-edit">
      <input 
        v-model="chartTitle" 
        class="chart-title-input" 
        placeholder="在此输入图表标题"
      />
    </div>

    <!-- Grid Wrapper (Scrollable container for the whole chart if it gets too big) -->
    <div class="chart-scroll-container">
      <div class="chart-content" :style="{ width: `${baseWidth * scaleX}px` }">
        
        <div class="main-area">
          <!-- Y Axis Label (Left Side) -->
           <div class="y-axis-label-container">
             <div class="y-axis-label">潜 力 (Potential)</div>
           </div>

          <!-- Y Axis Ticks -->
          <div class="y-ticks" :style="{ height: `${baseHeight * scaleY}px` }">
            <div class="tick-label">高 (A)</div>
            <div class="tick-label">中 (B)</div>
            <div class="tick-label">低 (C)</div>
          </div>

          <!-- The 3x3 Grid -->
          <div class="grid-board" :style="{ height: `${baseHeight * scaleY}px` }">
            <!-- Row 1: High Potential (A) -->
            <div class="grid-cell" :style="getStyle('C-A')">
              <span class="cell-label">能力低 / 潜力高</span>
              <div class="names"><span v-for="p in data['C-A']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
            <div class="grid-cell" :style="getStyle('B-A')">
              <span class="cell-label">能力中 / 潜力高</span>
              <div class="names"><span v-for="p in data['B-A']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
            <div class="grid-cell" :style="getStyle('A-A')">
              <span class="cell-label">能力高 / 潜力高</span>
              <div class="names"><span v-for="p in data['A-A']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag highlight" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>

            <!-- Row 2: Mid Potential (B) -->
            <div class="grid-cell" :style="getStyle('C-B')">
              <span class="cell-label">能力低 / 潜力中</span>
              <div class="names"><span v-for="p in data['C-B']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
            <div class="grid-cell" :style="getStyle('B-B')">
              <span class="cell-label">能力中 / 潜力中</span>
              <div class="names"><span v-for="p in data['B-B']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
            <div class="grid-cell" :style="getStyle('A-B')">
              <span class="cell-label">能力高 / 潜力中</span>
              <div class="names"><span v-for="p in data['A-B']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>

            <!-- Row 3: Low Potential (C) -->
            <div class="grid-cell" :style="getStyle('C-C')">
              <span class="cell-label">能力低 / 潜力低</span>
              <div class="names"><span v-for="p in data['C-C']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
            <div class="grid-cell" :style="getStyle('B-C')">
              <span class="cell-label">能力中 / 潜力低</span>
              <div class="names"><span v-for="p in data['B-C']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
            <div class="grid-cell" :style="getStyle('A-C')">
              <span class="cell-label">能力高 / 潜力低</span>
              <div class="names"><span v-for="p in data['A-C']" :key="p.name + '-' + p.ability + '-' + p.potential" class="name-tag" :style="{ fontSize: `${nameFontSize}px` }">{{ p.name }}</span></div>
            </div>
          </div>
        </div>

        <!-- X Axis Area -->
        <div class="x-axis-area">
          <div class="spacer-left"></div> <!-- Space for Y Label and Ticks -->
          <div class="x-ticks-container">
            <div class="x-ticks">
              <div class="tick-label">低 (C)</div>
              <div class="tick-label">中 (B)</div>
              <div class="tick-label">高 (A)</div>
            </div>
             <div class="x-axis-label">能 力 (Ability)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const scaleX = ref(1.0);
const scaleY = ref(1.0);
const nameFontSize = ref(14);
const chartTitle = ref('人才九宫格分布图');
const showSettings = ref(false);

const baseWidth = 900;
const baseHeight = 600;

// Default labels for config UI
const cellLabels = {
  'A-A': '超级明星 (A-A)',
  'B-A': '核心骨干 (B-A)',
  'C-A': '领域专家 (C-A)',
  'A-B': '明日之星 (A-B)',
  'B-B': '中坚力量 (B-B)',
  'C-B': '胜任员工 (C-B)',
  'A-C': '错配人才 (A-C)',
  'B-C': '吃力员工 (B-C)',
  'C-C': '问题员工 (C-C)'
};

// Visual order for settings panel (Top-Left to Bottom-Right)
// Row 1: C-A, B-A, A-A
// Row 2: C-B, B-B, A-B
// Row 3: C-C, B-C, A-C
const settingsOrder = [
  'C-A', 'B-A', 'A-A',
  'C-B', 'B-B', 'A-B',
  'C-C', 'B-C', 'A-C'
];

// Reactive styles state, initialized with previous requested colors
const cellStyles = reactive({
  'A-A': { bg: '#2C7A7B', opacity: 1, text: '#ffffff' }, // Dark Teal
  'B-A': { bg: '#38B2AC', opacity: 1, text: '#ffffff' }, // Teal
  'C-A': { bg: '#F6AD55', opacity: 1, text: '#ffffff' }, // Orange
  
  'A-B': { bg: '#38B2AC', opacity: 1, text: '#ffffff' }, // Teal
  'B-B': { bg: '#ECC94B', opacity: 1, text: '#333333' }, // Yellow
  'C-B': { bg: '#FBD38D', opacity: 1, text: '#333333' }, // Light Orange
  
  'A-C': { bg: '#4299E1', opacity: 1, text: '#ffffff' }, // Blue
  'B-C': { bg: '#90CDF4', opacity: 1, text: '#333333' }, // Light Blue
  'C-C': { bg: '#FC8181', opacity: 1, text: '#ffffff' }, // Red
});

// 读取上次的配色设置（localStorage 在部分离线/隐私环境下不可用，需容错）
const SETTINGS_KEY = 'nine-grid-settings';

const readStoredSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('配色设置读取失败，使用默认配色', e);
    return null;
  }
};

const writeStoredSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('配色设置保存失败', e);
  }
};

onMounted(() => {
  const parsed = readStoredSettings();
  if (!parsed) return;
  if (parsed.cellStyles) {
    Object.assign(cellStyles, parsed.cellStyles);
  }
  if (parsed.nameFontSize) {
    nameFontSize.value = parsed.nameFontSize;
  }
});

// Watch and save settings
watch(
  [cellStyles, nameFontSize],
  () => {
    writeStoredSettings({
      cellStyles,
      nameFontSize: nameFontSize.value
    });
  },
  { deep: true }
);

// Helper to generate dynamic style object for a cell
// Convert hex to rgba to support opacity
const getStyle = (key) => {
  const s = cellStyles[key];
  const hex = s.bg;
  // Simple hex to rgb
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${s.opacity})`,
    color: s.text
  };
};

</script>

<style scoped lang="scss">
.nine-grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden; 
}

.controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  
  .control-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .toggle-btn {
    padding: 6px 12px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    
    &:hover { background: #3aa876; }
  }
}

.settings-panel {
  width: 90%;
  max-width: 900px; // Match grid width roughly
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;

  h3 { margin-top: 0; margin-bottom: 15px; font-size: 16px; text-align: center; }

  .settings-grid {
    display: grid;
    // Strictly 3 columns to match the 9-grid layout
    grid-template-columns: 1fr 1fr 1fr; 
    gap: 10px;
  }

  .setting-item {
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    .setting-label {
      display: block;
      font-size: 13px; // Slightly bigger
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }
    
    .setting-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      justify-content: center;
      
      input[type=color] {
        border: none;
        width: 30px;
        height: 30px;
        cursor: pointer;
        padding: 0;
        background: none;
      }
      
      .opacity-control {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-width: 120px;
        
        label { font-size: 10px; color: #999; margin-bottom: 2px; }
        input[type=range] { width: 100%; cursor: pointer; }
      }
    }
  }
}

.header-edit {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  
  .chart-title-input {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 5px;
    width: 80%;
    outline: none;
    background: transparent;

    &:focus {
      border-bottom-color: #42b983;
    }
  }
}

.chart-scroll-container {
  width: 100%;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start; 
}

.chart-content {
  display: flex;
  flex-direction: column;
}

.main-area {
  display: flex;
  flex-direction: row;
}

.y-axis-label-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  margin-right: 10px;

  .y-axis-label {
    font-weight: bold;
    font-size: 18px;
    white-space: nowrap;
    // Standard vertical text for Chinese
    writing-mode: vertical-rl;
    text-orientation: mixed; 
    // Remove rotation so Chinese chars are upright
    transform: none;
    text-align: center;
    letter-spacing: 4px;
    // Ensure it centers in the flex container
    margin: 0 auto; 
  }
}

.y-ticks {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 10px;
  min-width: 50px;
  text-align: right;

  .tick-label {
    font-weight: bold;
    color: #333;
  }
}

.grid-board {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  border: 4px solid #333;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  flex-grow: 1; 

  .grid-cell {
    border: 1px solid rgba(255,255,255,0.3); // Softer border by default
    padding: 10px;
    display: flex;
    flex-direction: column;
    overflow-y: auto; 
    transition: background-color 0.3s;
    
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }

    .cell-label {
      font-size: 14px;
      // color: inherit; 
      // opacity: 0.9;
      color: rgba(0,0,0,0.6); // Slightly dark always visible? Or inherit? 
      // Let's use mix-blend? Or just rely on user picking good text contrast?
      // I'll stick to a semi-transparent black overlay logic for text if needed, 
      // but simplistic approach: rely on user.
      // Defaulting to what works for dark backgrounds (white text) or light (dark text) depends on config.
      // For now, inheriting color from getStyle.
      color: inherit;
      margin-bottom: 8px;
      align-self: center;
      flex-shrink: 0; 
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .names {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
      align-content: flex-start;
      
      .name-tag {
        background: #fff;
        border: none;
        border-radius: 12px; // Pill shape
        padding: 4px 10px; 
        font-size: 14px;  
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        color: #333;
        white-space: nowrap; 
        cursor: default;
        font-weight: 500;
        
        &.highlight {
          border: 2px solid #F6AD55; 
        }
      }
    }
  }
}

.x-axis-area {
  display: flex;
  margin-top: 10px;
}

.spacer-left {
  width: 110px; 
  flex-shrink: 0;
}

.x-ticks-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.x-ticks {
  display: flex;
  justify-content: space-around;
  width: 100%;
  
  .tick-label {
    font-weight: bold;
    color: #333;
  }
}

.x-axis-label {
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}
</style>
