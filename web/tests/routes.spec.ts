import { test, expect } from "@playwright/test";

// Rutas, protección y comportamiento básico sin sesión (no envía formularios al servidor)

test.describe("Protección de rutas (proxy)", () => {
  for (const path of ["/dashboard", "/dashboard/level-test", "/admin", "/admin/crm"]) {
    test(`${path} sin sesión redirige a login conservando ?next`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`/auth/login\\?next=${encodeURIComponent(path)}`));
    });
  }

  test("las URLs antiguas redirigen a las nuevas", async ({ request }) => {
    const testRedirect = await request.get("/tests/level-test", { maxRedirects: 0 });
    expect(testRedirect.headers().location).toContain("/dashboard/level-test");
    const questionnaireRedirect = await request.get("/dashboard/cuestionario", { maxRedirects: 0 });
    expect(questionnaireRedirect.headers().location).toContain("/dashboard/questionnaire");
  });

  test("cerrar sesión solo acepta POST", async ({ request }) => {
    expect((await request.get("/auth/signout")).status()).toBe(405);
  });
});

test.describe("Páginas públicas", () => {
  test("la landing muestra todas las secciones", async ({ page }) => {
    await page.goto("/");
    for (const id of ["idiomas", "como-funciona", "cursos", "examenes", "metodo", "testimonios", "faq", "contacto"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tu idioma");
  });

  test("las pestañas de cursos cambian de contenido", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Exámenes oficiales" }).click();
    await expect(page.getByRole("heading", { name: "Cambridge English" })).toBeVisible();
  });

  test("el formulario de contacto valida sin enviar", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(page.locator('#contacto [role="alert"]').first()).toBeVisible();
  });

  test("las páginas legales existen y las desconocidas dan 404", async ({ request }) => {
    for (const slug of ["aviso-legal", "privacidad", "cookies"]) {
      expect((await request.get(`/legal/${slug}`)).status()).toBe(200);
    }
    expect((await request.get("/legal/inventada")).status()).toBe(404);
  });

  test("verify-email muestra el email recibido", async ({ page }) => {
    await page.goto("/auth/verify-email?email=ana%40ejemplo.com");
    await expect(page.getByText("ana@ejemplo.com")).toBeVisible();
  });

  test("el registro valida los campos obligatorios", async ({ page }) => {
    await page.goto("/auth/registro", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Crear cuenta gratis" }).click();
    await expect(page.getByText("Debes aceptar la política de privacidad")).toBeVisible();
  });
});
