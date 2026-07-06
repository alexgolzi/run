const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.post('/run', (req, res) => {
    const code = req.body.code;
    const filename = `temp_${Date.now()}.js`;
    const filepath = path.join('/tmp', filename);

    fs.writeFileSync(filepath, code);

    // اجرای کد با محدودیت ۵ ثانیه
    exec(`node ${filepath}`, { timeout: 5000 }, (error, stdout, stderr) => {
        fs.unlinkSync(filepath); // پاک کردن فایل موقت

        if (error && !stdout) {
            return res.json({ output: null, error: error.message });
        }
        res.json({ output: stdout, error: stderr });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));