import Sentiment from 'sentiment';

export function analyzeSentiment(text: string) {
  const sentiment = new Sentiment();
  return sentiment.analyze(text);
}
