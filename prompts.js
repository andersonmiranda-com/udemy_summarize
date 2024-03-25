const getContentPrompt = (text, language) => {
  const prompts = {
    en: `I need a concise summary of the following text, structured in short paragraphs that directly engage with the core ideas,
      all while maintaining the original idiom of the text. Please avoid starting with 'the text...' or similar introductory phrases.
      The summary should dive straight into the substance:
      
      ${text}
      
      Please ensure that the summary is structured as requested. 
      The goal is to provide a clear and direct overview of the text's content, 
      avoiding generic introductions and capturing the essence of the information in a structured and accessible format, 
      true to the original style and tone.`,

    es: `Necesito un resumen conciso del siguiente texto en español, estructurado en párrafos cortos que aborden 
      directamente las ideas principales. Por favor, evite comenzar con 'el texto...' u otras frases introductorias similares. 
      El resumen debe profundizar directamente en la sustancia, presentando la información de manera clara y sucinta en el español.
      
      ${text}
      
      Asegúrese de que el resumen esté estructurado según lo solicitado, con los puntos principales resaltados en 
      párrafos cortos. El objetivo es proporcionar una visión clara y directa del contenido del texto, 
      evitando introducciones genéricas y capturando la esencia de la información de una manera estructurada y accesible, 
      fiel al estilo y tono original.`,

    pt: `Eu preciso de um resumo conciso do seguinte texto, estruturado em parágrafos curtos que abordem diretamente 
    as ideias centrais. Por favor, evite começar com 'o texto...' 
    ou frases introdutórias similares. O resumo deve mergulhar diretamente na substância.
    
    ${text}
    
    Por favor, garanta que o resumo esteja estruturado conforme solicitado, com os pontos principais destacados em 
    parágrafos curtos. O objetivo é fornecer uma visão clara e direta do conteúdo do texto, evitando introduções genéricas e 
    capturando a essência da informação de uma forma estruturada e acessível, fiel ao estilo e tom originais.`
  };

  return prompts[language];
};

const getTitlePrompt = (text, language) => {
  const prompts = {
    en: `Please translate the following title to English, ensuring the translation is accurate and captures 
    the essence of the original title. Keep the number on beginning of the title if it is present:
      
      ${text}`,

    es: `Por favor, traduce el siguiente título al español, asegurando que la traducción sea precisa y 
    capture la esencia del título original. Mantenga el número al principio del título si está presente:

    ${text}`,

    pt: `Por favor, traduza o seguinte título para o inglês, garantindo que a tradução seja precisa e 
    capture a essência do título original. Mantenha o número no início do título, se ele estiver presente:

    ${text}`
  };

  return prompts[language];
};

module.exports = { getTitlePrompt, getContentPrompt };
