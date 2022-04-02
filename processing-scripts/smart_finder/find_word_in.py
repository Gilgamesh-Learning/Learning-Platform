import json
import spacy
import argparse
import os

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Transcribe an audio file')
    parser.add_argument('input', type=str)
    parser.add_argument('input_word', type=str)
    parser.add_argument('output_times_json', type=str)
    args = parser.parse_args()

    nlp = spacy.load('en_core_web_lg')

    all_sents = json.load(open(os.path.relpath(args.input)))

    with open(args.output_times_json, 'w+') as f:
        f.write('{"timestamps": [{"start": 1200, "end": 1200}]}')

#    for sent in all_sents:
#        print(sent)


