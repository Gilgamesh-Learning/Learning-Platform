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

    for ind in range(len(in_split)):
        vid = (
            in_file
            .trim(start = in_split[ind]['start'] / 1000, end = in_split[ind]['end'] / 1000)
            .setpts('PTS-STARTPTS')
        )
        aud = (
            in_file
            .filter_('atrim', start = in_split[ind]['start'] / 1000, end = in_split[ind]['end'] / 1000)
            .filter_('asetpts', 'PTS-STARTPTS')
        )

        joined = ffmpeg.concat(vid, aud, v=1, a=1)

        if ind == 0:
            output_file = joined
        else:
            output_file = ffmpeg.concat(output_file, joined)

    output_file.output(args.output_video).run_async()
