const WDIOReporter = require('@wdio/reporter').default;
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelReporter extends WDIOReporter {
    constructor(options) {
        super(options);
        this.options = Object.assign({
            outputDir: './reports',
            filename: 'E2E_Test_Report.xlsx'
        }, options);
        
        this.results = [];
        this.testIdCounter = 1;
    }

    onTestPass(test) {
        this.results.push({
            id: `TC-${this.testIdCounter++}`,
            name: test.title,
            suite: test.parent,
            status: 'PASS',
            duration: test._duration,
            error: ''
        });
    }

    onTestFail(test) {
        this.results.push({
            id: `TC-${this.testIdCounter++}`,
            name: test.title,
            suite: test.parent,
            status: 'FAIL',
            duration: test._duration,
            error: test.error ? test.error.message : 'Unknown Error'
        });
    }

    onRunnerEnd(runner) {
        if (!fs.existsSync(this.options.outputDir)){
            fs.mkdirSync(this.options.outputDir, { recursive: true });
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('E2E Test Results');

        // Define columns
        sheet.columns = [
            { header: 'Test ID', key: 'id', width: 15 },
            { header: 'Suite / Category', key: 'suite', width: 30 },
            { header: 'Test Case Description', key: 'name', width: 50 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Error Logs', key: 'error', width: 60 }
        ];

        // Add rows
        this.results.forEach(res => {
            const row = sheet.addRow(res);
            row.getCell('status').font = {
                color: { argb: res.status === 'PASS' ? 'FF008000' : 'FFFF0000' },
                bold: true
            };
        });

        // Style headers
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };

        const filePath = path.join(this.options.outputDir, this.options.filename);
        workbook.xlsx.writeFile(filePath).then(() => {
            console.log(`\n[ExcelReporter] E2E Excel Report generated successfully at: ${filePath}\n`);
        }).catch(err => {
            console.error('[ExcelReporter] Error generating Excel report:', err);
        });
    }
}

module.exports = ExcelReporter;
