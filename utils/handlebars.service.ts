import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

interface HandlebarsData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class HandlebarsService {
  private static instance: HandlebarsService;
  private readonly templatesDir: string;

  private constructor() {
    this.templatesDir = path.join(process.cwd(), 'templates');
     // ✅ Register ordinal helper here
    Handlebars.registerHelper("ordinal", function (index: number) {
      const n = index + 1;
      const suffix =
        n % 10 === 1 && n % 100 !== 11
          ? "st"
          : n % 10 === 2 && n % 100 !== 12
          ? "nd"
          : n % 10 === 3 && n % 100 !== 13
          ? "rd"
          : "th";
      return `${n}${suffix}`;
    });
  }

  public static getInstance(): HandlebarsService {
    if (!HandlebarsService.instance) {
      HandlebarsService.instance = new HandlebarsService();
    }
    return HandlebarsService.instance;
  }

  public compileTemplate(templateName: string, data: HandlebarsData): string {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.html`);
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(templateSource);
      return template(data);
    } catch (error) {
      console.error(`Error compiling template ${templateName}:`, error);
      throw new Error(`Failed to compile template: ${templateName}`);
    }
  }
}