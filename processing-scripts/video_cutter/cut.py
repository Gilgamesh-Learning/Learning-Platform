import ffmpeg
import argparse
import json
import os

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Trim and concatenate file, when silences are detected')
    parser.add_argument('input', type=str)
    parser.add_argument('split_info', type=str)
    parser.add_argument('output_video', type=str)
    args = parser.parse_args()

    in_file = ffmpeg.input(args.input)
    in_split = json.load(open(os.path.relpath(args.split_info)))['split_info']

    output_file = in_file.trim(start = in_split[0]['start'], end = in_split[0]['end'])

    for ind in range(1, len(in_split) - 1):
        vid = (
            in_file
            .trim(start = in_split[ind]['start'], end = in_split[ind]['end'])
            .setpts('PTS-STARTPTS')
        )
        aud = (
            in_file
            .filter_('atrim', start = in_split[ind]['start'], end = in_split[ind]['end'])
            .filter_('asetpts', 'PTS-STARTPTS')
        )

        joined = ffmpeg.concat(vid, aud, v=1, a=1)

        output_file = ffmpeg.concat(output_file, joined)

    output_file.output(args.output_video).run_async()
