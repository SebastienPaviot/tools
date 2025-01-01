var predictinuse=false;
(async () => {
  const APP = {
    model: null,
    size: 256,
    source: document.getElementById('source'),
    canvas: document.getElementById('result'),
    status: document.getElementById('status'),
    download: document.getElementById('download'),
    $: id => document.getElementById(id),
    path: './models/CartoonGAN/web-uint8/model.json',
  };

  try {
    // Configure TensorFlow.js avec WebAssembly
    await tf.setBackend('wasm');
    console.log("Backend configuré à WebAssembly.");

    // Charger le modèle
    console.log("Chargement du modèle...");
    APP.model = await tf.loadGraphModel(APP.path);
    console.log("Modèle chargé avec succès.");

    // Warm-up du modèle pour améliorer les performances
    APP.model.predict(tf.zeros([1, 1, 1, 3])).dispose();
    console.log("Modèle prêt.");

    // Gestion des événements
    document.getElementById('file').addEventListener('change', handleFileUpload);
    document.querySelectorAll('#examples img').forEach(img =>
      img.addEventListener('click', () => {
        APP.source.src = img.src;
      })
    );

  } catch (error) {
    console.error("Erreur d'initialisation :", error.message);
    APP.status.textContent = "Une erreur est survenue. Vérifiez la console pour plus de détails.";
  }

  async function handleFileUpload(evt) {
    const file = evt.target.files[0];
    if (!file || !file.type.match('image.*')) {
      console.warn('Le fichier sélectionné n\'est pas une image.');
      evt.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      APP.source.src = e.target.result;
      console.log(`Image chargée : ${file.name}`);
    };

    reader.onerror = () => console.error(`Erreur de lecture pour le fichier : ${file.name}`);
    reader.readAsDataURL(file);
    evt.target.value = '';
  }

  APP.source.onload = () => {
   

    setTimeout(() => {
      predict(APP.source);
    }, 50);
  };

  async function predict(imgElement) {
    predictinuse=true;
    console.log("Prédiction en cours...");
    let img = tf.browser.fromPixels(imgElement);
    const shape = img.shape;
    const [w, h] = shape;

    // Normalisation de l'image
    img = normalize(img);

    // Début de la prédiction
    const t0 = performance.now();
    const result = await APP.model.predict({ 'input_photo:0': img });
    const timer = performance.now() - t0;

    let img_out = await result.squeeze().sub(tf.scalar(-1)).div(tf.scalar(2)).clipByValue(0, 1);
    const pad = Math.round(Math.abs(w - h) / Math.max(w, h) * APP.size);
    const slice = (w > h) ? [0, pad, 0] : [pad, 0, 0];
    img_out = img_out.slice(slice);

    draw(img_out, shape);
    console.log(`Temps de traitement : ${Math.round(timer / 1000 * 10) / 10} secondes`);
    predictinuse=false;
  }

  function normalize(img) {
    const [w, h] = img.shape;
    const pad = (w > h)
      ? [[0, 0], [w - h, 0], [0, 0]]
      : [[h - w, 0], [0, 0], [0, 0]];

    img = img.pad(pad);
    const size = APP.size;
    img = tf.image.resizeBilinear(img, [size, size]).reshape([1, size, size, 3]);
    const offset = tf.scalar(127.5);
    return img.sub(offset).div(offset);
  }

  function draw(img, size) {
    const scaleby = size[0] / img.shape[0];
    tf.browser.toPixels(img, APP.canvas);
    APP.canvas.classList.remove('d-none');
    APP.canvas.classList.add('d-block');
    APP.status.classList.add('d-none');

    setTimeout(() => scaleCanvas(scaleby), 250);
  }

  function scaleCanvas(pct = 2) {
    const canvas = APP.$('result');
    const tmpCanvas = document.createElement('canvas');
    const tctx = tmpCanvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    tmpCanvas.width = cw;
    tmpCanvas.height = ch;
    tctx.drawImage(canvas, 0, 0);

    canvas.width *= pct;
    canvas.height *= pct;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(tmpCanvas, 0, 0, cw, ch, 0, 0, cw * pct, ch * pct);

    // Met à jour le lien de téléchargement
    APP.download.href = canvas.toDataURL('image/jpeg');
  }
})();
