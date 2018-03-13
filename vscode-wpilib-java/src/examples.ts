'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import { IExampleTemplateAPI, IExampleTemplateCreator } from './shared/externalapi';

interface JsonLayout {
  name: string;
  description: string;
  tags: string[];
}

export class Examples {
  private readonly exampleResourceName = 'javaexamples.json';

  constructor(resourceRoot: string, core: IExampleTemplateAPI) {
    const resourceFile = path.join(resourceRoot, 'examples', this.exampleResourceName);
    fs.readFile(resourceFile, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const examples: JsonLayout[] = jsonc.parse(data);
      for (const e of examples) {
        const provider: IExampleTemplateCreator = {
          getLanguage(): string {
            return 'java';
          },
          getDescription(): string {
            return e.description;
          },
          getDisplayName(): string {
            return e.name;
          },
          async generate(_: vscode.Uri): Promise<boolean> {
            console.log('run generation');
            return true;
          }
        };
        core.addExampleProvider(provider);
      }
    });
  }

  public dispose() {

  }
}
