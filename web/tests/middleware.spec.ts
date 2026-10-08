import { test, expect } from '@playwright/test';

test.describe('Protección de Rutas - Middleware', () => {
  
  test('Los usuarios no autenticados son redirigidos al login al intentar acceder a /admin', async ({ page }) => {
    await page.goto('/admin');
    
    // Debería redirigir a auth/login
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test('Los usuarios no autenticados son redirigidos al login al intentar acceder a /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Debería redirigir a auth/login
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});
