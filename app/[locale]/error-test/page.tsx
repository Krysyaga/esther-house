'use client';

export default function ErrorTest() {
  // Cette page force une erreur 500 pour tester la page d'erreur
  throw new Error('Test erreur 500 - Page de maintenance');
}
