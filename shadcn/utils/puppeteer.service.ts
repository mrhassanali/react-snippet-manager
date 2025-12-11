import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer, { type PDFOptions } from "puppeteer";

export class PuppeteerService {
  private static instance: PuppeteerService;

  private constructor() {}

  public static getInstance(): PuppeteerService {
    if (!PuppeteerService.instance) {
      PuppeteerService.instance = new PuppeteerService();
    }
    return PuppeteerService.instance;
  }

  /**
   * Default PDF options
   */
  private getDefaultPdfOptions(): PDFOptions {
    return {
      format: "Legal",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    };
  }

  /**
   * Generate PDF from HTML content
   * @param htmlContent - HTML string to convert to PDF
   * @param options - Optional PDF options to override defaults
   * @returns PDF Buffer
   */
  public async generatePdf(
    htmlContent: string,
    options?: Partial<PDFOptions>
  ): Promise<Buffer> {
    const isServerless = Boolean(
      process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL
    );

    const browser = isServerless
      ? await puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          defaultViewport: chromium.defaultViewport,
        })
      : await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      // Merge default options with user-provided options
      const pdfOptions = {
        ...this.getDefaultPdfOptions(),
        ...options,
      };

      const pdfBuffer = await page.pdf(pdfOptions);

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate screenshot from HTML content
   * @param htmlContent - HTML string to convert to screenshot
   * @param options - Screenshot options
   * @returns Screenshot Buffer
   */
  public async generateScreenshot(
    htmlContent: string,
    options?: {
      type?: "png" | "jpeg" | "webp";
      quality?: number;
      fullPage?: boolean;
    }
  ): Promise<Buffer> {
    const isServerless = Boolean(
      process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL
    );

    const browser = isServerless
      ? await puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          defaultViewport: chromium.defaultViewport,
        })
      : await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const screenshot = await page.screenshot({
        type: options?.type || "png",
        quality: options?.quality,
        fullPage: options?.fullPage ?? true,
      });

      return Buffer.from(screenshot);
    } finally {
      await browser.close();
    }
  }
}