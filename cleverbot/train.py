from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

chatbot = ChatBot("lita")
chatbot.set_trainer(ChatterBotCorpusTrainer)

# Train based on the english corpus
chatbot.train("chatterbot.corpus.english")

# Train based on english greetings corpus
chatbot.train("chatterbot.corpus.english.greetings")

# Train based on the english conversations corpus
chatbot.train("chatterbot.corpus.english.conversations")
