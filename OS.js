import { spawn } from 'child_process';

export class OS {
    static async execute(command) {
        // return await new Promise(resolve => exec(command, (err, stdout, stderr) => {
        //     const ret = (stdout || '') + (stderr || '');
        //     resolve(ret);
        // }))
        const sp = spawn(
            'powershell.exe',
            [
                '-NoProfile', '-Command',
                command,
            ]
        );
        sp.stdout.setEncoding('utf8');
        sp.stderr.setEncoding('utf8');
        sp.stdin.setEncoding('utf8');

        sp.stdout.pipe(process.stdout);
        sp.stderr.pipe(process.stderr);
        process.stdin.pipe(sp.stdin);

        let out = '';
        sp.stdout.on('data', data => out += data);
        sp.stderr.on('data', err => out += err);
        // process.stdin.on('close', data => out += data);

        return await new Promise(resolve => sp.on('close', () => resolve(out)));
    }
}