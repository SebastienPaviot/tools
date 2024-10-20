// Sauvegarder l'ancienne méthode console.error
const originalConsole = console.log;

// Redéfinir console.error pour ajouter 'toto' et envoyer un POST
console.log = function(...args) {
    const stackTrace = new Error().stack;

    // Extraire la ligne et le fichier à partir de la stack trace
    const callerLine = stackTrace.split("\n")[1].trim(); // La ligne juste après la ligne d'appel de l'erreur
    
    // Ajouter 'error ' comme premier argument, suivi des arguments et de la ligne d'origine
    const errorMessage = ['log ', ...args, `(at ${callerLine})`].join(' ');
  // Afficher l'erreur dans la console
  originalConsole(errorMessage);
  
  // Envoyer l'erreur en POST à 'test.com'
  fetch('log.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ log : errorMessage })
  }).catch((error) => {
    originalConsole("Erreur lors de l'envoi de l'erreur: ", error);
  });
};


   // Sauvegarder l'ancienne méthode console.error
   const originalConsoleError = console.error;

// Redéfinir console.error pour ajouter 'toto' et envoyer un POST
console.error = function(...args) {
    const stackTrace = new Error().stack;

    // Extraire la ligne et le fichier à partir de la stack trace
    const callerLine = stackTrace.split("\n")[1].trim(); // La ligne juste après la ligne d'appel de l'erreur
    
    // Ajouter 'error ' comme premier argument, suivi des arguments et de la ligne d'origine
    const errorMessage = ['error ', ...args, `(at ${callerLine})`].join(' ');

  // Afficher l'erreur dans la console
  originalConsoleError(errorMessage);
  
  // Envoyer l'erreur en POST à 'test.com'
  fetch('log.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ log : errorMessage })
  }).catch((error) => {
    originalConsoleError("Erreur lors de l'envoi de l'erreur: ", error);
  });
};
