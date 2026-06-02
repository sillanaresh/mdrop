import { expect, Page, test } from "@playwright/test"

async function mockHealth(page: Page) {
  await page.route("**/health", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "ok", version: "1.0.0" }),
    })
  })
}

test("first screen is responsive and conversion-focused", async ({ page }) => {
  await mockHealth(page)
  await page.goto("/")

  await expect(page.getByRole("heading", { name: /drop source material/i })).toBeVisible()
  await expect(page.getByText("Drop a file here")).toBeVisible()
  await expect(page.getByRole("button", { name: "Convert URL" })).toBeDisabled()
  await expect(page.getByText("Ready for conversion")).toBeVisible()

  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )
  expect(hasHorizontalScroll).toBe(false)
})

test("invalid URL shows a useful recovery state", async ({ page }) => {
  await mockHealth(page)
  await page.goto("/")

  await page.getByPlaceholder(/example.com/).fill("ftp://example.com")
  await page.getByRole("button", { name: "Convert URL" }).click()

  await expect(page.getByRole("heading", { name: "The URL is not valid" })).toBeVisible()
  await expect(page.getByText("Use a public URL that starts with http:// or https://.")).toBeVisible()
  await page.getByRole("button", { name: "Try another source" }).click()
  await expect(page.getByText("Drop a file here")).toBeVisible()
})

test("file conversion reaches the Markdown review workspace", async ({ page }) => {
  await mockHealth(page)
  await page.route("**/convert", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        markdown: "# Sample CSV\n\n| name | score |\n| --- | --- |\n| Ada | 10 |",
        title: "Sample CSV",
        filename: "sample.csv",
        format: "csv",
        char_count: 58,
        word_count: 12,
        processing_time_ms: 42,
      }),
    })
  })

  await page.goto("/")
  await page.locator('input[type="file"]').setInputFiles({
    name: "sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,score\nAda,10\n"),
  })

  await expect(page.getByText("Markdown ready")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Sample CSV" }).first()).toBeVisible()
  await expect(page.getByRole("button", { name: "Copy" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible()
  await expect(page.getByText("Ada")).toBeVisible()
})
