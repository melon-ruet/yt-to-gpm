from __future__ import unicode_literals
import youtube_dl
from gmusicapi import Musicmanager


def my_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')


file_path = 'dl.mp3'
ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': file_path,
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
    'progress_hooks': [my_hook],
}
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=JylZrg49aXU'])

manager = Musicmanager()
credential = 'oauth.cred'
# manager.perform_oauth(storage_filepath=credential)
manager.login(oauth_credentials=credential)
manager.upload(file_path)
