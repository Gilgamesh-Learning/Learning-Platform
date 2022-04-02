import json
import spacy
import argparse
import os
import numpy as np
import math

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Find a word in an audio file')
    parser.add_argument('input', type=str)
    parser.add_argument('input_word', type=str)
    parser.add_argument('output_times_json', type=str)
    args = parser.parse_args()

    nlp = spacy.load('en_core_web_lg')

    all_sents = json.load(open(os.path.relpath(args.input)))['split_info']

    input_word = nlp(args.input_word)[0]
    input_word_vector = input_word.vector / (np.linalg.norm(input_word.vector) + 1e-16)

    words = []

    for sent in all_sents:
        sent['text'] = sent['text'].lower()

    simil_with_input = lambda x: np.sum(np.multiply(x.vector, input_word_vector)) / (np.linalg.norm(x.vector) + 1e-16)

    def remove_duplicate_tokens(tokens):
        ret_tokens = []

        for token in tokens:
            cnt = 0
            for other in tokens:
                if other.text == token.text:
                    cnt += 1
                if cnt > 2:
                    break
            if cnt == 1:
                ret_tokens.append(token)

        return ret_tokens

    def get_val_from_sent(sent):
        tokens = list(filter(lambda x: x.text != '.', nlp(sent['text'])))
        tokens = remove_duplicate_tokens(tokens)

        CNT_ITER = 4
        if len(tokens) < CNT_ITER:
            return 0

        tokens.sort(key = lambda x: -simil_with_input(x))

        sum = 0
        for i in range(CNT_ITER):
            sum += simil_with_input(tokens[i])

        return sum / CNT_ITER

    timestamps = []

    time_now = 0

    for sent in all_sents:
        timestamps.append({'time': time_now + (sent['end'] - sent['start']) / 2, 'relevant': get_val_from_sent(sent)})
        time_now += sent['end'] - sent['start']

    with open(args.output_times_json, 'w+') as f:
        json.dump(timestamps, f)

