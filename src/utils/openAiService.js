import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAiServices = {}
  
openAiServices.streamChat = async (messages, res) => {
  try {
    // Configurar los headers para streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    messages = messages.map(message => {
      if (message.role === 'user' || message.role === 'system' || message.role === 'assistant') {
        return {
          role: message.role,
          content: message.content
        }
      }
      return message
    })

    const stream = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: "Eres un asistente que me ayuda con dudas de Kafka Apache",
      input: messages,
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'response.output_item.added') {
        res.write('data: ' + JSON.stringify({ start: true, type: event.item.type }) + '\n\n');
      }
      const content = event?.delta || '';
      if (content) {
        res.write('data: ' + JSON.stringify({ content }) + '\n\n');
      }
      if (event.type === 'response.completed') {
        messages = event.response.output
      }
    }

    // Enviar señal de finalización
    res.write('data: ' + JSON.stringify({ done: true, messages }) + '\n\n');
    res.end();

  } catch (error) {
    console.error('Error en el streaming del chat:', error);
    res.write('data: ' + JSON.stringify({ error: error.message }) + '\n\n');
    res.end();
  }
};

export default openAiServices
