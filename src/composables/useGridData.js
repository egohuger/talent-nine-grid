import { ref } from 'vue';
import * as XLSX from 'xlsx';

const LEVELS = ['A', 'B', 'C'];

// 九宫格共 9 格，键为「能力-潜力」，与 NineGrid.vue 中的格子一一对应
const EMPTY_GRID = () => ({
  'C-A': [], 'B-A': [], 'A-A': [],
  'C-B': [], 'B-B': [], 'A-B': [],
  'C-C': [], 'B-C': [], 'A-C': [],
});

export function useGridData() {
  const gridData = ref(EMPTY_GRID());
  const rawData = ref([]);
  const errorMsg = ref('');
  const stats = ref({ total: 0, parsed: 0, skipped: 0, skippedNames: [] });

  const reset = () => {
    gridData.value = EMPTY_GRID();
    rawData.value = [];
    stats.value = { total: 0, parsed: 0, skipped: 0, skippedNames: [] };
  };

  const processFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        errorMsg.value = 'Excel 文件里没有工作表';
        return;
      }
      const worksheet = workbook.Sheets[sheetName];
      // 只用第一张表；表头占第 1 行，数据从第 2 行开始；blankrows:false 直接丢掉整行空白
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });

      if (jsonData.length < 2) {
        errorMsg.value = 'Excel 文件为空或格式不正确（至少需要表头 + 1 行数据）';
        return;
      }

      reset();

      let parsed = 0;
      let skipped = 0;
      const skippedNames = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        // 列数不足 3 的行直接跳过（不中断整表解析）
        if (!row || row.length < 3) continue;

        const name = row[0];
        const ability = (row[1] ?? '').toString().toUpperCase().trim();
        const potential = (row[2] ?? '').toString().toUpperCase().trim();

        if (!name) continue;

        if (LEVELS.includes(ability) && LEVELS.includes(potential)) {
          const key = `${ability}-${potential}`;
          gridData.value[key].push({ name, ability, potential });
          rawData.value.push({ name, ability, potential });
          parsed++;
        } else {
          skipped++;
          if (skippedNames.length < 8) skippedNames.push(name);
        }
      }

      stats.value = { total: parsed + skipped, parsed, skipped, skippedNames };
      errorMsg.value = parsed === 0
        ? '没有解析到有效数据：请检查 B 列（能力）与 C 列（潜力）是否填了 A / B / C'
        : '';
    } catch (e) {
      console.error(e);
      errorMsg.value = '解析文件时出错: ' + e.message;
    }
  };

  return {
    gridData,
    rawData,
    processFile,
    errorMsg,
    stats,
  };
}
