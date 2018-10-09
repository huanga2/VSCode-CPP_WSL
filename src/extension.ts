'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cppwsl-config" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.RequestWSLConfig', () => {
        const https = require('https');

        https.get('https://raw.githubusercontent.com/Microsoft/vscode-cpptools/master/Documentation/LanguageServer/Windows%20Subsystem%20for%20Linux.md', (resp:any) => {
            let data = '';

            resp.on('data', (chunk:any) => {
                data += chunk;
            })

            resp.on('end', () => {
                var re = new RegExp('\`\`\`json([^]+?)\`\`\`', 'gm');
                var match1 = re.exec(data);
                if (match1 != null) {
                    const fs = require('fs');
                    const path = require('path');

                    var wslconfig = JSON.parse(match1[1]);
                    var workspaceroot = vscode.workspace.workspaceFolders![0].uri.fsPath;
                    var config_file = path.join(workspaceroot, '.vscode', 'c_cpp_properties.json');
                    fs.readFile(config_file, 'utf8', (err:any, data:any) => {
                        if (err) throw err;

                        var config = JSON.parse(data);
                        config['configurations'].push(wslconfig);
                        console.log(config);
                        fs.writeFile(config_file, JSON.stringify(config, null, 4), (err:any, data:any) => {
                            if (err) throw err;
                        });
                    })
                }
                else {
                    vscode.window.showInformationMessage('Failed to retrieve config.');
                    return;
                }
            })
        })
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}