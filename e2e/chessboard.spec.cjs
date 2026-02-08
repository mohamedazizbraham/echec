const { test, expect } = require('@playwright/test');

test('plateau affiché + pièces initiales', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('chessboard')).toBeVisible();

    await expect(page.getByTestId('square-0-0')).toHaveAttribute('data-piece', 'r'); // tour noire
    await expect(page.getByTestId('square-0-4')).toHaveAttribute('data-piece', 'k'); // roi noir
    await expect(page.getByTestId('square-6-0')).toHaveAttribute('data-piece', 'P'); // pion blanc
    await expect(page.getByTestId('square-7-3')).toHaveAttribute('data-piece', 'Q'); // dame blanche
    await expect(page.getByTestId('square-4-4')).toHaveAttribute('data-piece', '');
});

test('drag & drop : déplacer un pion blanc (coup légal)', async ({ page }) => {
    await page.goto('/');

    const fromSquare = page.getByTestId('square-6-0'); // a2
    const toSquare = page.getByTestId('square-5-0');   // a3

    await expect(fromSquare).toHaveAttribute('data-piece', 'P');
    await expect(toSquare).toHaveAttribute('data-piece', '');

    await page.getByTestId('piece-6-0').dragTo(toSquare);

    await expect(fromSquare).toHaveAttribute('data-piece', '');
    await expect(toSquare).toHaveAttribute('data-piece', 'P');
});

test('drag & drop : coup illégal refusé (pion en diagonale sans capture)', async ({ page }) => {
    await page.goto('/');

    const fromSquare = page.getByTestId('square-6-0'); // a2
    const illegalTarget = page.getByTestId('square-5-1'); // b3 (vide au départ)

    await expect(fromSquare).toHaveAttribute('data-piece', 'P');
    await expect(illegalTarget).toHaveAttribute('data-piece', '');

    // Tentative illégale : un pion ne peut pas aller en diagonale si aucune capture
    await page.getByTestId('piece-6-0').dragTo(illegalTarget);

    // La pièce doit rester à l'origine, la cible doit rester vide
    await expect(fromSquare).toHaveAttribute('data-piece', 'P');
    await expect(illegalTarget).toHaveAttribute('data-piece', '');
});
