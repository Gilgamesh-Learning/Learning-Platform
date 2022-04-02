import argparse
import speech_recognition as sr
import os
from sys import stderr
from pydub import AudioSegment
from pydub.silence import split_on_silence
from pydub.silence import detect_nonsilent
import time
import tempfile
import json

def transcribe(filename):
    r = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio = r.record(source)

    try:
        return r.recognize_google(audio)
    except sr.UnknownValueError:
        print('Could not recognize speech', file=stderr)
        return None
    except sr.RequestError as e:
        print(f'Sphinx error: {e}', file=stderr)

# https://www.thepythoncode.com/article/using-speech-recognition-to-convert-speech-to-text-python
def transcribe_in_chunks(path_input):
    r = sr.Recognizer()

    begin_split = time.time()

    MS = 1000

    sound = AudioSegment.from_wav(path_input)
    chunks = split_on_silence(sound,
        min_silence_len = 750,
        silence_thresh = sound.dBFS-14,
        keep_silence=500,
    )
    non_silent = detect_nonsilent(sound,
        min_silence_len=750,
        silence_thresh=sound.dBFS-14,
        seek_step=1
    )

    print(len(chunks), len(non_silent))
    print(f'Split took {time.time() - begin_split}s')

    ret = []

    for i, audio_chunk in enumerate(chunks):
        fp = tempfile.NamedTemporaryFile()
        audio_chunk.export(fp.name, format="wav")
        with sr.AudioFile(fp.name) as source:
            audio_listened = r.record(source)
            text = ""
            try:
                text = r.recognize_google(audio_listened)
            except sr.UnknownValueError as e:
                print("Error:", str(e))
            else:
                text = f"{text.capitalize()}. "
                print(fp.name, ":", text)

            ret.append({'text': text, 'start': non_silent[i][0], 'end': non_silent[i][1]})
            print({'text': text, 'start': non_silent[i][0] / MS, 'end': non_silent[i][1] / MS})
    return ret


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Transcribe an audio file')
    parser.add_argument('input', type=str)
    parser.add_argument('output_splits', type=str)
    args = parser.parse_args()

    # print(transcribe(args.input))
    ret_json = {
        'split_info': transcribe_in_chunks(args.input)
    }
    with open(args.output_splits, 'w') as outfile:
        json.dump(json.dumps(ret_json), outfile)