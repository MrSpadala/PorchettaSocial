## Main Server

comunica con i client ed è il punto di snodo tra le varie componenti

# Run
 - per farlo runnare su docker: sudo docker build -t mainserver . && sudo docker run --rm -p 80:8080 mainserver
 - per farlo runnare velocemente: node mainserver.js (assicurarsi di avere installato il body-parser: 'npm install --save body-parser')
