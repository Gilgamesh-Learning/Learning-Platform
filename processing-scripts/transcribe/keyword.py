import spacy
import pytextrank
import argparse

text = ""

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Extract keywords and keyphrases')
    parser.add_argument('input', type=str)
    args = parser.parse_args()

    with open(args.input, 'r') as file:
        text = file.read()

    nlp = spacy.load("en_core_web_lg")

    nlp.add_pipe("textrank")
    doc = nlp(text)

    for phrase in doc._.phrases:
        print(phrase.text, phrase.rank, phrase.count)