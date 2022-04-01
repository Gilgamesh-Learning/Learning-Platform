import argparse
import speech_recognition as sr
import os
from sys import stderr
from pydub import AudioSegment
from pydub.silence import split_on_silence
import time

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
def transcribe_in_chunks(path):
    r = sr.Recognizer()

    begin_split = time.time()

    sound = AudioSegment.from_wav(path)
    chunks = split_on_silence(sound,
        min_silence_len = 500,
        silence_thresh = sound.dBFS-14,
        keep_silence=500,
    )

    print(f'Split took {time.time() - begin_split}s')

    folder_name = "audio-chunks"

    if not os.path.isdir(folder_name):
        os.mkdir(folder_name)

    whole_text = ""

    for i, audio_chunk in enumerate(chunks, start=1):
        chunk_filename = os.path.join(folder_name, f"chunk{i}.wav")
        audio_chunk.export(chunk_filename, format="wav")
        with sr.AudioFile(chunk_filename) as source:
            audio_listened = r.record(source)
            try:
                text = r.recognize_google(audio_listened)
            except sr.UnknownValueError as e:
                print("Error:", str(e))
            else:
                text = f"{text.capitalize()}. "
                print(chunk_filename, ":", text)
                whole_text += text

    return whole_text

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Transcribe an audio file')
    parser.add_argument('input', type=str)
    args = parser.parse_args()

    # print(transcribe(args.input))
    print(transcribe_in_chunks(args.input))
