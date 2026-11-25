import { router } from '@inertiajs/react';

/**
 * Remembers which text keys and image slots the current page asked for as plain values
 * (placeholders, calculator labels, background slots…). The editor lists them in a side panel,
 * because they cannot be edited by clicking on them.
 */
export const usedTexts = new Set<string>();
export const usedImages = new Set<string>();

router.on('start', (event) => {
  // A partial reload of the same page (after saving) keeps the list.
  if (event.detail.visit.only.length === 0) {
    usedTexts.clear();
    usedImages.clear();
  }
});
