const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 3000;

app.use(express.json());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.post("/verificar_ofensivo", async (req, res) => {
  try {
    const texto = req.body.texto;

    const mensaje = '"' + texto + '"';
    const promt =
      "¿El siguiente texto tiene lenguaje ofensivo, odio, acoso o violencia? Si contiene la respuesta será 'true', si no contiene será 'false', solo quiero una palabra como respuesta. " +
      mensaje;

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: promt }],
      temperature: 0.6,
    };

    const completion = await openai.createChatCompletion(apiRequestBody);
    const completionResp = completion.data.choices[0].message.content;
    const cadena = completionResp.toLowerCase();
    const sinEspacios = cadena.replace(/\s/g, "");
    const sinPuntos = sinEspacios.replace(/\./g, "");

    const esOfensivo = sinPuntos === "true";

    res.json({ esOfensivo });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Hubo un error en el servidor" });
  }
});

app.listen(port, () => {
  console.log(`La API está en funcionamiento en http://localhost:${port}`);
});

